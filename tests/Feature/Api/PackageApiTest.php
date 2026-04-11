<?php

use App\Models\Business;
use App\Models\Driver;
use App\Models\Package;
use App\Models\User;

beforeEach(function () {
    $this->business = Business::factory()->create();
    $this->admin = User::factory()->admin($this->business)->create();
    $this->client = User::factory()->forBusiness($this->business)->create();
    $this->driverUser = User::factory()->driver($this->business)->create();
    $this->driver = Driver::factory()->for($this->business)->for($this->driverUser)->create();
});

// Index tests

test('admin can list packages for their business', function () {
    Package::factory()->forBusiness($this->business)->forClient($this->client)->count(3)->create();

    $response = $this->actingAs($this->admin, 'sanctum')
        ->getJson('/api/packages');

    $response->assertOk()
        ->assertJsonPath('total', 3);
});

test('client can list their own packages', function () {
    Package::factory()->forBusiness($this->business)->forClient($this->client)->count(2)->create();

    $response = $this->actingAs($this->client, 'sanctum')
        ->getJson('/api/packages');

    $response->assertOk()
        ->assertJsonPath('total', 2);
});

test('driver can list their assigned packages', function () {
    Package::factory()->forBusiness($this->business)->forClient($this->client)->forDriver($this->driver)->count(2)->create();

    $response = $this->actingAs($this->driverUser, 'sanctum')
        ->getJson('/api/packages');

    $response->assertOk();
});

test('unauthenticated user cannot list packages', function () {
    $response = $this->getJson('/api/packages');

    $response->assertUnauthorized();
});

// Store tests

test('admin can create a package', function () {
    $data = [
        'sender_name' => 'Sender Test',
        'recipient_name' => 'Recipient Test',
        'delivery_address' => '123 Test St',
        'business_id' => $this->business->id,
    ];

    $response = $this->actingAs($this->admin, 'sanctum')
        ->postJson('/api/packages', $data);

    $response->assertCreated()
        ->assertJsonPath('message', 'Package created successfully')
        ->assertJsonPath('package.sender_name', 'Sender Test');

    $this->assertDatabaseHas('packages', [
        'sender_name' => 'Sender Test',
        'business_id' => $this->business->id,
    ]);
});

test('package creation generates unique tracking code', function () {
    $data = [
        'sender_name' => 'Sender',
        'recipient_name' => 'Recipient',
        'delivery_address' => '123 Test St',
        'business_id' => $this->business->id,
    ];

    $response = $this->actingAs($this->admin, 'sanctum')
        ->postJson('/api/packages', $data);

    $response->assertCreated();
    expect($response->json('package.tracking_code'))->toStartWith('TRK');
});

test('cannot create package with invalid business_id', function () {
    $data = [
        'sender_name' => 'Sender',
        'recipient_name' => 'Recipient',
        'delivery_address' => '123 Test St',
        'business_id' => 99999,
    ];

    $response = $this->actingAs($this->admin, 'sanctum')
        ->postJson('/api/packages', $data);

    $response->assertUnprocessable();
});

test('cannot create package with missing required fields', function () {
    $response = $this->actingAs($this->admin, 'sanctum')
        ->postJson('/api/packages', ['sender_name' => 'Test']);

    $response->assertUnprocessable();
});

// Show tests

test('can show package by tracking code', function () {
    $package = Package::factory()->forBusiness($this->business)->forClient($this->client)->create();

    $response = $this->actingAs($this->admin, 'sanctum')
        ->getJson("/api/packages/{$package->tracking_code}");

    $response->assertOk()
        ->assertJsonPath('tracking_code', $package->tracking_code);
});

test('returns 404 for non-existent tracking code', function () {
    $response = $this->actingAs($this->admin, 'sanctum')
        ->getJson('/api/packages/NONEXISTENT');

    $response->assertNotFound();
});

// Update status tests

test('can update package status from pending to in_transit', function () {
    $package = Package::factory()->forBusiness($this->business)->forClient($this->client)->pending()->create();

    $response = $this->actingAs($this->admin, 'sanctum')
        ->patchJson("/api/packages/{$package->id}/status", ['status' => 'in_transit']);

    $response->assertOk()
        ->assertJsonPath('package.status', 'in_transit');
});

test('can update package status from in_transit to delivered', function () {
    $package = Package::factory()->forBusiness($this->business)->forClient($this->client)->inTransit()->create();

    $response = $this->actingAs($this->admin, 'sanctum')
        ->patchJson("/api/packages/{$package->id}/status", ['status' => 'delivered']);

    $response->assertOk()
        ->assertJsonPath('package.status', 'delivered');
});

test('cannot skip status from pending to delivered', function () {
    $package = Package::factory()->forBusiness($this->business)->forClient($this->client)->pending()->create();

    $response = $this->actingAs($this->admin, 'sanctum')
        ->patchJson("/api/packages/{$package->id}/status", ['status' => 'delivered']);

    $response->assertBadRequest();
});

test('cannot update status with invalid value', function () {
    $package = Package::factory()->forBusiness($this->business)->forClient($this->client)->create();

    $response = $this->actingAs($this->admin, 'sanctum')
        ->patchJson("/api/packages/{$package->id}/status", ['status' => 'invalid']);

    $response->assertUnprocessable();
});

// Destroy tests

test('can delete a package', function () {
    $package = Package::factory()->forBusiness($this->business)->forClient($this->client)->create();

    $response = $this->actingAs($this->admin, 'sanctum')
        ->deleteJson("/api/packages/{$package->id}");

    $response->assertOk()
        ->assertJsonPath('message', 'Package deleted');

    $this->assertDatabaseMissing('packages', ['id' => $package->id]);
});

test('returns 404 when deleting non-existent package', function () {
    $response = $this->actingAs($this->admin, 'sanctum')
        ->deleteJson('/api/packages/99999');

    $response->assertNotFound();
});

// Track (public) tests

test('public tracking endpoint returns package info', function () {
    $package = Package::factory()->forBusiness($this->business)->forClient($this->client)->create();

    $response = $this->getJson("/api/track/{$package->tracking_code}");

    $response->assertOk()
        ->assertJsonPath('tracking_code', $package->tracking_code)
        ->assertJsonPath('status', $package->status)
        ->assertJsonPath('business.name', $this->business->name);
});

test('public tracking returns 404 for unknown code', function () {
    $response = $this->getJson('/api/track/UNKNOWN123');

    $response->assertNotFound();
});

// Filter tests

test('can filter packages by status', function () {
    Package::factory()->forBusiness($this->business)->forClient($this->client)->pending()->count(2)->create();
    Package::factory()->forBusiness($this->business)->forClient($this->client)->inTransit()->count(3)->create();

    $response = $this->actingAs($this->admin, 'sanctum')
        ->getJson('/api/packages?status=in_transit');

    $response->assertOk()
        ->assertJsonPath('total', 3);
});

test('can search packages by tracking code', function () {
    $package = Package::factory()->forBusiness($this->business)->forClient($this->client)->create();

    $response = $this->actingAs($this->admin, 'sanctum')
        ->getJson('/api/packages?search='.$package->tracking_code);

    $response->assertOk()
        ->assertJsonPath('total', 1);
});
