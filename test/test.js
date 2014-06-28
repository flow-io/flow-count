
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Stream spec:
	spec = require( 'stream-spec' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	cStream = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'count', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( cStream ).to.be.a( 'function' );
	});

	it( 'should provide a method to get the initial accumulator value', function test() {
		var rStream = cStream();
		expect( rStream.value() ).to.be.a( 'number' );
	});

	it( 'should provide a method to set the initial accumulator value', function test() {
		var rStream = cStream();
		rStream.value( 5 );
		assert.strictEqual( rStream.value(), 5 );
	});

	it( 'should not allow a non-numeric initial accumulator value', function test() {
		var rStream = cStream();
		
		expect( badValue( '5' ) ).to.throw( Error );
		expect( badValue( [] ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );
		expect( badValue( function(){} ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				rStream.value( value );
			};
		}
	});

	it( 'should count piped data', function test( done ) {
		var numData = 1000,
			data = new Array( numData ),
			rStream, s;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			data[ i ] = Math.random();
		}

		// Create a new count stream:
		rStream = cStream().stream();

		// Create the stream spec:
		s = spec( rStream )
			.through();

		// Mock reading from the stream:
		utils.readStream( rStream, onRead );

		// Validate the stream when the stream closes:
		rStream.on( 'close', s.validate );

		// Mock piping a data to the stream:
		utils.writeStream( data, rStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], numData );
			done();
		} // end FUNCTION onRead()
	});

	it( 'should count piped data using an arbitrary starting value', function test( done ) {
		var numData = 1000,
			data = new Array( numData ),
			reducer, rStream,
			initValue = 999;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			data[ i ] = Math.random();
		}

		// Create a new count stream generator:
		reducer = cStream();

		// Set the initial count and create a new stream:
		rStream = reducer.value( initValue )
			.stream();

		// Mock reading from the stream:
		utils.readStream( rStream, onRead );

		// Mock piping a data to the stream:
		utils.writeStream( data, rStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], numData+initValue );
			done();
		} // end FUNCTION onRead()
	});

});