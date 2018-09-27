package main

import "bytes"

// TXOutput represens a transaction output
type TXOutput struct {
	Value      int
	PubKeyHash []byte
}

// Lock signs the output
func (out *TXOutput) Lock(address []byte) {
	pubKeyHash := Base58Decode(address)
	pubKeyHash = pubKeyHash[1 : len(pubKeyHash)-addressChecksumLen]
	//比特币实际上用的锁定脚本,这里只实现简单版的地址
	out.PubKeyHash = pubKeyHash
}

// IsLockedWithKey checks if the output can be used by the owner of the pubkey
func (out *TXOutput) IsLockedWithKey(pubKeyHash []byte) bool {
	//TODO 吴名 2018/9/27 10:31 并未用使用解锁脚本(这里简化了)
	return bytes.Compare(out.PubKeyHash, pubKeyHash) == 0
}

// NewTXOutput create a new TXOutput
func NewTXOutput(value int, address string) *TXOutput {
	txo := &TXOutput{
		value, nil,
	}
	txo.Lock([]byte(address))

	return txo
}
