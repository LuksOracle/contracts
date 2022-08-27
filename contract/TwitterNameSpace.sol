// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TwitterNameSpace is ChainlinkClient { 

    using Chainlink for Chainlink.Request;

    mapping(address => uint96) public addressTwitterID;
    mapping(uint96 => address) public twitterIDaddress;

    event tweetRequestEvent();

    modifier twitterMatchesAccount(uint96 twitter_id,address checkAddress){
        require(twitterIDaddress[twitter_id] == checkAddress, "You have not verified this Twitter ID with your account yet.");
        _;
    }

    constructor()  {
        setChainlinkToken(0xbFB26279a9D28CeC1F781808Da89eFbBfE2c4268);
        setChainlinkOracle(0x401ae6Bfb89448fB6e06CE7C9171a8A0366d02d0);
    }

    function requestTweetAddressCompare(uint96 twitter_id_Request) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest("31c6d9c97ae64e6da1d82cdf4b4077ad", address(this), this.fulfillTweetAddressCompare.selector);
        req.add("twitter_id"   , Strings.toString(twitter_id_Request));                                    // Point at specific Tweet.
        req.add("address_owner", Strings.toHexString(uint160(msg.sender), 20) ); //Point at msg.sender (type string to handle Chainlink request).
        return sendChainlinkRequest(req, 1 ether);
    }

    function fulfillTweetAddressCompare(bytes32 _requestId, bytes32 compressedAddressUint96) public recordChainlinkFulfillment(_requestId) {
        uint96  decodeTwitterID = uint96(uint((compressedAddressUint96>>160)));
        address decodeAddressID = address(uint160(uint(compressedAddressUint96 & 0x000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)));
        if(compressedAddressUint96 != 0x0000000000000000000000000000000000000000000000000000000000000000){
            if(twitterIDaddress[decodeTwitterID] != address(0)){
                addressTwitterID[twitterIDaddress[decodeTwitterID]] = 0;
            }
                addressTwitterID[decodeAddressID] = decodeTwitterID;
                twitterIDaddress[decodeTwitterID] = decodeAddressID;
        }
        emit tweetRequestEvent();
    }

    function resolveToTwitterID(uint96 _twitter_id) public twitterMatchesAccount(_twitter_id,msg.sender){
        addressTwitterID[msg.sender] = _twitter_id;
    }

}
