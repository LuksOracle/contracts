// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

contract MockTwitterNameSpace {

    uint public isTwitterAddressMatching;

    mapping(address => uint96) public addressTwitterID;
    mapping(uint96 => address) public twitterIDaddress;

    event tweetRequestEvent();

    modifier twitterMatchesAccount(uint96 twitter_id,address checkAddress){
        require(twitterIDaddress[twitter_id] == checkAddress, "You have not verified this Twitter ID with your account yet.");
        _;
    }

    function requestTweetAddressCompare(uint96 twitter_id_Request) public {
        //Mock fulfill response
        bytes32 compressedAddressUint96;
        uint tempRequestAddress;
        uint tempTwitter_id;
        uint shiftedTempTwitter_id;
        if(isTwitterAddressMatching == 1){
            //Emulate response
            tempRequestAddress = uint(uint160(msg.sender));
            tempTwitter_id = twitter_id_Request;
            shiftedTempTwitter_id = tempTwitter_id<<160;
            compressedAddressUint96 = bytes32(shiftedTempTwitter_id + tempRequestAddress);
        }

        //Fulfill mock update
        if(compressedAddressUint96 != 0x0000000000000000000000000000000000000000000000000000000000000000){
        uint96  decodeTwitterID = uint96(uint((compressedAddressUint96>>160)));
        address decodeAddressID = address(uint160(uint(compressedAddressUint96 & 0x000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)));
            if(twitterIDaddress[decodeTwitterID] != address(0)){
                addressTwitterID[twitterIDaddress[decodeTwitterID]] = 0;
            }
                addressTwitterID[decodeAddressID] = decodeTwitterID;
                twitterIDaddress[decodeTwitterID] = decodeAddressID;
        }
        emit tweetRequestEvent();
    }

    function mockRequestAnswer(uint setTwitterAddressMatching) public {
        isTwitterAddressMatching = setTwitterAddressMatching;
    }

    function resolveToTwitterID(uint96 _twitter_id) public twitterMatchesAccount(_twitter_id,msg.sender){
        addressTwitterID[msg.sender] = _twitter_id;
    }

}
