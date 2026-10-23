import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateAutoFare,
  distanceInKilometres,
  eligibleDrivers,
  vehicleForPassengerCount,
} from '../src/domain/ride-rules.ts';

test('auto fare is 10 rupees per kilometre plus 10 per passenger', () => {
  assert.equal(calculateAutoFare(4.2, 1), 52);
  assert.equal(calculateAutoFare(4.2, 3), 72);
  assert.equal(calculateAutoFare(0, 2), 20);
  assert.throws(() => calculateAutoFare(-1, 1), RangeError);
  assert.throws(() => calculateAutoFare(4.2, 0), RangeError);
});

test('vehicle selection follows the passenger capacity threshold', () => {
  assert.equal(vehicleForPassengerCount(3), 'E-rickshaw');
  assert.equal(vehicleForPassengerCount(4), 'CNG auto-rickshaw');
  assert.throws(() => vehicleForPassengerCount(0), RangeError);
});

test('matching requires a known pickup and active drivers within 10 km', () => {
  const pickup = { latitude: 30, longitude: 78 };
  const drivers = [
    { id: 'near-active', active: true, location: { latitude: 30.05, longitude: 78 } },
    { id: 'far-active', active: true, location: { latitude: 30.1, longitude: 78 } },
    { id: 'near-inactive', active: false, location: { latitude: 30.01, longitude: 78 } },
  ];

  assert.deepEqual(eligibleDrivers(null, drivers), []);
  assert.deepEqual(
    eligibleDrivers(pickup, drivers).map((driver) => driver.id),
    ['near-active']
  );
});

test('matching includes drivers exactly 10 km from a known pickup', () => {
  const pickup = { latitude: 0, longitude: 0 };
  const boundaryLatitude = (10 / 6371) * (180 / Math.PI);
  const boundary = {
    id: 'boundary',
    active: true,
    location: { latitude: boundaryLatitude, longitude: 0 },
  };

  assert.equal(distanceInKilometres(pickup, boundary.location), 10);
  assert.deepEqual(eligibleDrivers(pickup, [boundary]), [boundary]);
});