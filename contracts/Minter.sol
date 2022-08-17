// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0; 

contract Coin {
    constructor() {
        minter = msg.sender;
    }
    // The keyword "public" makes those variables
    // readable from outside.
    address public minter;
    mapping (address => uint) public balances;


    // TODO: Check the bug with this method
    // Events allow light clients to react on
    // changes efficiently.
    event Sent(address from, address to, uint amount);

    function mint(address receiver, uint amount) public  {
        if (msg.sender != minter) return;
        balances[receiver] += amount;
    }

    function send(address receiver, uint amount) public {
        if (balances[msg.sender] < amount) return;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        Sent(msg.sender, receiver, amount);
    }
}
