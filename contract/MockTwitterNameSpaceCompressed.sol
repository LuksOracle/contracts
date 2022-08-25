// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

contract MockTwitterNameSpace { 

    uint public _addressFromTweetMatches = 1;

    mapping(address => uint96) public addressTwitterID;
    mapping(uint96 => address) public twitterIDaddress;

    event tweetRequestEvent();

    modifier twitterMatchesAccount(uint96 twitter_id,address checkAddress){
        require(twitterIDaddress[twitter_id] == checkAddress, "You have not verified this Twitter ID with your account yet.");
        _;
    }

    function requestTweetAddressCompare(uint96 twitter_id_Request) public {
        //Emulate compressed data uint96 and address answer.
        uint uintTwitterID = twitter_id_Request;
        uint uintAddress = uint(uint160(msg.sender));
        uint uintShiftedTwitterID = uintTwitterID<<160;
        uint compressedAddressUint96 = uintShiftedTwitterID + uintAddress;
        //Fulfilled data will be decoded here
        uint96 decodeTwitterID = uint96((compressedAddressUint96>>160));
        address decodeAddressID = address(uint160(compressedAddressUint96 & 0x000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF));
        if(_addressFromTweetMatches == 1){
            if(twitterIDaddress[twitter_id_Request] != address(0)){
                addressTwitterID[twitterIDaddress[twitter_id_Request]] = 0;
            }
                addressTwitterID[decodeAddressID] = decodeTwitterID;
                twitterIDaddress[decodeTwitterID] = decodeAddressID;
        }
        emit tweetRequestEvent();
    }

    function mockRequestAnswer(uint mockRequestReturnValue) public {
       _addressFromTweetMatches = mockRequestReturnValue;
    }

    function resolveToTwitterID(uint96 _twitter_id) public twitterMatchesAccount(_twitter_id,msg.sender){
        addressTwitterID[msg.sender] = _twitter_id;
    }

}
