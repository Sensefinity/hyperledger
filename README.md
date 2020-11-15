# Sensefinity on Ubuntu

## Install docker
```
apt install docker.io
systemctl start docker
systemctl enable docker
curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

## Install go
```
wget https://dl.google.com/go/go1.12.13.linux-amd64.tar.gz
tar -xf go1.12.13.linux-amd64.tar.gz
chown -R root:root ./go
mv go /usr/local
rm go1.12.13.linux-amd64.tar.gz
mkdir $HOME/work
```

Put following lines at the end of file ~/.profile
```
export GOPATH=$HOME/work
export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin
```

## Bringing network up
```
./pullBinaries.sh
./network.sh up createChannel
./network.sh deployCC
docker-compose up -d
```

## Setting up env for CLI
```
export PATH=${PWD}/bin:$PATH
export FABRIC_CFG_PATH=$PWD/config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.blockchain.sensefinity.com/peers/peer0.org1.blockchain.sensefinity.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.blockchain.sensefinity.com/users/Admin@org1.blockchain.sensefinity.com/msp
export CORE_PEER_ADDRESS=localhost:7051
```

## Commands

### To invoke chaincode
```
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.blockchain.sensefinity.com --tls --cafile ${PWD}/organizations/ordererOrganizations/blockchain.sensefinity.com/orderers/orderer.blockchain.sensefinity.com/msp/tlscacerts/tlsca.blockchain.sensefinity.com-cert.pem -C mychannel -n sensefinity -c '{"Args":["CreateDevice","101","device1"]}'
```

### To query chaincode
```
peer chaincode query -C mychannel -n sensefinity -c '{"Args":["QueryDevices", "{\"selector\":{\"docType\":\"device\",\"name\":\"device1\"}, \"use_index\":[\"_design/deviceNameDoc\", \"deviceName\"]}"]}'
```

## Cleanup
```
./network.sh down
```
