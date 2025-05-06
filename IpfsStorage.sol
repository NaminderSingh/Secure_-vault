// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

contract Upload {

    struct Image {
        string ipfsHash;
        string name;
    }

    mapping(address => Image[]) private userFiles;

    modifier onlyOwnerAccess(address _user) {
        require(msg.sender == _user, "You are not authorized");
        _;
    }

    function uploadFile(address _user, string memory _ipfsHash, string memory _name) external {
        userFiles[_user].push(Image(_ipfsHash, _name));
    }

    function viewFiles(address _user) external view onlyOwnerAccess(_user) returns (Image[] memory) {
        return userFiles[_user];
    }

    function deleteFile(address _user, uint256 index) external onlyOwnerAccess(_user) {
        require(index < userFiles[_user].length, "Invalid index");

        for (uint256 i = index; i < userFiles[_user].length - 1; i++) {
            userFiles[_user][i] = userFiles[_user][i + 1];
        }

        userFiles[_user].pop();
    }
}
