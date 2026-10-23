import AsyncStorage from '@react-native-async-storage/async-storage';

const RIDE_KEY = 'rishirides.demo.rides';

export type DemoRideStatus = 'requested' | 'accepted' | 'driver_arriving' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';

export type DemoRide = {
  id: string;
  passengerMobile: string;
  driverMobile?: string;
  driverName?: string;
  driverRating?: number;
  driverLocation?: { latitude: number; longitude: number };
  pickup: string;
  destination: string;
  vehicle: string;
  estimate: number;
  status: DemoRideStatus;
  createdAt: number;
  updatedAt: number;
};

async function readRides(): Promise<DemoRide[]> {
  const stored = await AsyncStorage.getItem(RIDE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as DemoRide[];
  } catch {
    await AsyncStorage.removeItem(RIDE_KEY);
    return [];
  }
}

async function saveRides(rides: DemoRide[]): Promise<void> {
  await AsyncStorage.setItem(RIDE_KEY, JSON.stringify(rides));
}

export async function getDemoRides(): Promise<DemoRide[]> {
  return (await readRides()).sort((left, right) => right.createdAt - left.createdAt);
}

export async function createDemoRide(input: Omit<DemoRide, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<DemoRide> {
  const rides = await readRides();
  const now = Date.now();
  const ride: DemoRide = {
    ...input,
    id: `ride-${now}-${Math.random().toString(36).slice(2, 8)}`,
    status: 'requested',
    createdAt: now,
    updatedAt: now,
  };
  await saveRides([ride, ...rides]);
  return ride;
}

export async function acceptDemoRide(
  rideId: string,
  driverMobile: string,
  driver?: {
    name?: string;
    rating?: number;
    location?: { latitude: number; longitude: number };
  },
): Promise<DemoRide> {
  const rides = await readRides();
  if (rides.some((ride) => ride.driverMobile === driverMobile && ['accepted', 'driver_arriving', 'in_progress'].includes(ride.status))) {
    throw new Error('Finish your active demo trip before accepting another request.');
  }
  const ride = rides.find((entry) => entry.id === rideId);
  if (!ride || ride.status !== 'requested') throw new Error('This demo request is no longer available.');
  ride.driverMobile = driverMobile;
  ride.driverName = driver?.name;
  ride.driverRating = driver?.rating;
  ride.driverLocation = driver?.location;
  ride.status = 'accepted';
  ride.updatedAt = Date.now();
  await saveRides(rides);
  return ride;
}

export async function updateDemoRideStatus(rideId: string, status: DemoRideStatus, actorMobile: string): Promise<DemoRide> {
  const rides = await readRides();
  const ride = rides.find((entry) => entry.id === rideId);
  if (!ride) throw new Error('Demo ride not found.');
  const allowed: Record<DemoRideStatus, DemoRideStatus[]> = {
    requested: ['cancelled'],
    accepted: ['driver_arriving', 'cancelled'],
    driver_arriving: ['in_progress', 'cancelled'],
    in_progress: ['completed'],
    completed: [],
    cancelled: [],
    rejected: [],
  };
  const isPassengerCancel = status === 'cancelled' && actorMobile === ride.passengerMobile;
  const isDriverUpdate = actorMobile === ride.driverMobile && allowed[ride.status].includes(status);
  if (!isPassengerCancel && !isDriverUpdate) throw new Error(`Cannot change demo ride from ${ride.status} to ${status}.`);
  ride.status = status;
  ride.updatedAt = Date.now();
  await saveRides(rides);
  return ride;
}

export async function rejectDemoRide(rideId: string): Promise<void> {
  const rides = await readRides();
  const ride = rides.find((entry) => entry.id === rideId);
  if (!ride || ride.status !== 'requested') return;
  ride.status = 'rejected';
  ride.updatedAt = Date.now();
  await saveRides(rides);
}
