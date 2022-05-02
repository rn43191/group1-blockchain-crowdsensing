// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CrowdSensing {
    uint256 public requestCount = 0;

    struct Request {
        uint256 id;
        address requester;
        string title;
        string description;
        uint256 reward;
        uint256 workersNum;
        string[] datas;
    }

    mapping(uint256 => Request) public requests;

    event RequestAdded(
        uint256 id,
        address requester,
        string title,
        string description,
        uint256 reward,
        uint256 workersNum
    );

    event DataAdded(uint256 id, string data);

    // ====================================

    constructor() public payable {}

    function recover(bytes32 hash, bytes memory signature)
        private
        pure
        returns (address)
    {
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Check the signature length
        if (signature.length != 65) {
            return (address(0));
        }

        // Divide the signature in r, s and v variables
        // ecrecover takes the signature parameters, and the only way to get them
        // currently is to use assembly.
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        // If the version is correct return the signer address
        if (v != 27 && v != 28) {
            return (address(0));
        } else {
            // solium-disable-next-line arg-overflow
            return ecrecover(hash, v, r, s);
        }
    }

    // ====================================

    function balanceOf() external view returns (uint256) {
        return address(this).balance;
    }

    function addRequest(
        address _requester,
        string memory _title,
        string memory _description,
        uint256 _reward,
        uint256 _workersNum,
        bytes32 hash,
        bytes memory signature
    ) public payable {
        address _signer = recover(hash, signature);
        require(_signer == _requester);
        requestCount++;

        requests[requestCount].id = requestCount;
        requests[requestCount].requester = _requester;
        requests[requestCount].title = _title;
        requests[requestCount].description = _description;
        requests[requestCount].reward = _reward;
        requests[requestCount].workersNum = _workersNum;

        emit RequestAdded(
            requestCount,
            _requester,
            _title,
            _description,
            _reward,
            _workersNum
        );
    }

    function addData(
        address payable _worker,
        uint256 _reward,
        uint256 _id,
        string memory _data,
        bytes32 hash,
        bytes memory signature
    ) public payable {
        address _signer = recover(hash, signature);
        require(_signer == requests[_id].requester);

        require(requests[_id].datas.length < requests[_id].workersNum);

        requests[_id].datas.push(_data);

        _worker.transfer(_reward);

        emit DataAdded(_id, _data);
    }

    function getDatas(uint256 _rId) public view returns (string[] memory) {
        return (requests[_rId].datas);
    }
}
