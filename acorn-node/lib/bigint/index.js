/* Generated by `npm run build`, do not edit! */

"use strict"

var acorn = require("acorn")
var tt = acorn.tokTypes
var isIdentifierStart = acorn.isIdentifierStart

module.exports = function(Parser) {
  return /*@__PURE__*/(function (Parser) {
    function anonymous () {
      Parser.apply(this, arguments);
    }

    if ( Parser ) anonymous.__proto__ = Parser;
    anonymous.prototype = Object.create( Parser && Parser.prototype );
    anonymous.prototype.constructor = anonymous;

    anonymous.prototype.parseLiteral = function parseLiteral (value) {
      var node = Parser.prototype.parseLiteral.call(this, value)
      if (node.raw.charCodeAt(node.raw.length - 1) == 110) { node.bigint = this.getNumberInput(node.start, node.end) }
      return node
    };

    anonymous.prototype.readRadixNumber = function readRadixNumber (radix) {
      var start = this.pos
      this.pos += 2 // 0x
      var val = this.readInt(radix)
      if (val === null) { this.raise(this.start + 2, ("Expected number in radix " + radix)) }
      if (this.input.charCodeAt(this.pos) == 110) {
        var str = this.getNumberInput(start, this.pos)
        val = typeof BigInt !== "undefined" ? BigInt(str) : null
        ++this.pos
      } else if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number") }
      return this.finishToken(tt.num, val)
    };

    anonymous.prototype.readNumber = function readNumber (startsWithDot) {
      var start = this.pos

      // Not an int
      if (startsWithDot) { return Parser.prototype.readNumber.call(this, startsWithDot) }

      // Legacy octal
      if (this.input.charCodeAt(start) === 48 && this.input.charCodeAt(start + 1) !== 110) {
        return Parser.prototype.readNumber.call(this, startsWithDot)
      }

      if (this.readInt(10) === null) { this.raise(start, "Invalid number") }

      // Not a BigInt, reset and parse again
      if (this.input.charCodeAt(this.pos) != 110) {
        this.pos = start
        return Parser.prototype.readNumber.call(this, startsWithDot)
      }

      var str = this.getNumberInput(start, this.pos)
      var val = typeof BigInt !== "undefined" ? BigInt(str) : null
      ++this.pos
      return this.finishToken(tt.num, val)
    };

    // This is basically a hook for acorn-numeric-separator
    anonymous.prototype.getNumberInput = function getNumberInput (start, end) {
      if (Parser.prototype.getNumberInput) { return Parser.prototype.getNumberInput.call(this, start, end) }
      return this.input.slice(start, end)
    };

    return anonymous;
  }(Parser))
}