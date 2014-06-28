/**
*
*	STREAM: count
*
*
*	DESCRIPTION:
*		- Monitors a stream for new data. Each streamed datum increments a counter. On end, the stream returns the data count.
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	HISTORY:
*		- 2014/05/22: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] flow-reduce
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*/

(function() {
	'use strict';

	// MODULES //

	var // Stream reduce:
		reducer = require( 'flow-reduce' );


	// FUNCTIONS //

	/**
	* FUNCTION: reduce( acc, data )
	*	Defines the data reduction.
	*
	* @private
	* @param {number} acc - the value accumulated
	* @param {number} data - numeric stream data
	* @returns {number} reduced data
	*/
	function reduce( count, x ) {
		return count + 1;
	} // end FUNCTION reduce()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		// Default accumulator value:
		this._value = 0;

		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: value( value )
	*	Setter and getter for initial value from which to begin accumulation. If a value is provided, sets the initial accumulation value. If no value is provided, returns the accumulation value.
	*
	* @param {number} value - initial value
	* @returns {object|number} instance object or initial value
	*/
	Stream.prototype.value = function( value ) {
		if ( !arguments.length ) {
			return this._value;
		}
		if ( typeof value !== 'number' || value !== value ) {
			throw new Error( 'value()::invalid input argument. Initial accumulator value must be numeric.' );
		}
		this._value = value;
		return this;
	}; // end METHOD value()

	/**
	* METHOD: stream()
	*	Returns a JSON data reduction stream for calculating the statistic.
	*
	* @returns {stream} reduce stream
	*/
	Stream.prototype.stream = function() {
		var rStream = reducer()
			.reduce( reduce )
			.acc( this._value )
			.stream();
		return rStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();