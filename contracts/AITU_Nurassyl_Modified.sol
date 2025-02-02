// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AITU_Nurassyl_Modified is ERC20 {
    event TransactionInfo(
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        uint256 timestamp
    );

    address private lastSender;
    address private lastReceiver;
    uint256 private lastTimestamp;

    constructor(uint256 initialSupply) ERC20("AITU_Nurassyl_SE-2327_Token", "UTK") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function transfer(address recipient, uint256 amount)
        public
        override
        returns (bool)
    {
        bool success = super.transfer(recipient, amount);

        if (success) {
            lastSender = msg.sender;
            lastReceiver = recipient;
            lastTimestamp = block.timestamp;

            emit TransactionInfo(msg.sender, recipient, amount, block.timestamp);
        }

        return success;
    }

    function getLastTransactionTimestamp() public view returns (string memory) {
        return _convertTimestampToReadableFormat(lastTimestamp);
    }

    function getLastTransactionSender() public view returns (address) {
        return lastSender;
    }

    function getLastTransactionReceiver() public view returns (address) {
        return lastReceiver;
    }

    function _convertTimestampToReadableFormat(uint256 timestamp)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked("Timestamp: ", uint2str(timestamp)));
    }

    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + (_i % 10)));
            _i /= 10;
        }
        return string(bstr);
    }
}
