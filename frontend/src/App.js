import { useEffect, useState } from "react";
import Web3 from "web3";
import { Divider, Button, notification } from "antd";
import _toNumber from "lodash/toNumber";
import _toString from "lodash/toString";
import { HiOutlineRefresh } from "react-icons/hi";

import "antd/es/divider/style/css";
import "antd/es/button/style/css";
import "antd/es/notification/style/css";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/Header";
import Loader from "./components/Loader";
import RequestModal from "./components/RequestModal";
import DataModal from "./components/DataModal";
import RequestsList from "./components/RequestsList";
import Contract from "./contracts/Contract.json";

import Green from "./assets/images/Green.jpeg";

import "./index.css";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [web3Provider, setWeb3Provider] = useState({});
  const [contract, setContract] = useState({});
  const [balance, setBalance] = useState(null);
  const [ganacheAC, setGanacheAC] = useState([]);

  const [addRequestModalVisible, setAddRequestModalVisible] = useState(false);
  const [addDataModalVisible, setAddDataModalVisible] = useState(false);

  const [requestCount, setRequestCount] = useState(0);
  const [requests, setRequests] = useState([]);

  const showErrorNotification = (message) =>
    notification.error({
      message: message,
      placement: "bottom",
    });

  const updateBalance = async (_web3, _contract) => {
    try {
      const _balance = await _contract.methods.balanceOf().call();
      setBalance(_web3?.utils?.fromWei(_balance, "ether"));
    } catch (error) {
      console.log("👉 | updateBalance | error", error);
    }
  };

  const fetchRequests = async (_contract) => {
    try {
      const _requestCount = await _contract.methods.requestCount().call();
      setRequestCount(_requestCount);
      const _requests = [];
      for (let i = 1; i <= _requestCount; i++) {
        const _request = await _contract.methods.requests(i).call();
        const _datas = await _contract.methods.getDatas(i).call();
        _requests.push({ ..._request, datas: _datas });
      }

      setRequests(_requests);

      console.log("👉 | fetchRequests | _requestCount", _requestCount);
      console.log("👉 | fetchRequests | _requests", _requests);
    } catch (error) {}
  };

  const addRequest = async (args) => {
    setLoading(true);
    try {
      const msghash = web3Provider.utils.sha3(
        JSON.stringify({ title: args.title, reward: args.reward })
      );
      const result = await web3Provider.eth.sign(msghash, account);
      contract.methods
        .addRequest(
          account,
          args.title,
          args.description,
          web3Provider.utils.toHex(
            web3Provider.utils.toWei(args.reward, "ether")
          ),
          _toNumber(args.workersNum),
          msghash,
          result
        )
        .send({
          from: account,
          value: web3Provider.utils.toHex(
            web3Provider.utils.toWei(args.reward, "ether")
          ),
        })
        .on("receipt", (receipt) => {
          fetchRequests(contract);
          setLoading(false);
        })
        .on("error", (error) => {
          showErrorNotification(error.message);
          fetchRequests(contract);
          setLoading(false);
        });
    } catch (error) {
      showErrorNotification(error.message);
      fetchRequests(contract);
      setLoading(false);
    }
  };

  const addData = async (address, reward, request, data) => {
    setLoading(true);
    try {
      const msghash = web3Provider.utils.sha3(
        JSON.stringify({ title: request.title, reward: request.reward })
      );
      const result = await web3Provider.eth.sign(msghash, account);
      contract.methods
        .addData(address, _toString(reward), request.id, data, msghash, result)
        .send({ from: account })
        .on("receipt", (receipt) => {
          fetchRequests(contract);
          setLoading(false);
        })
        .on("error", (error) => {
          console.log(error.message);
          fetchRequests(contract);
          setLoading(false);
        });
    } catch (error) {
      console.log(error.message);
      fetchRequests(contract);
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);

      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      setWeb3Provider(web3);
      console.log(web3.eth.accounts.wallet);
      const accounts = await web3.eth.requestAccounts();
      console.log(web3, accounts);
      setAccount(accounts[0]);

      const _ganache = new Web3("http://localhost:7545");
      const _ganacheAC = await _ganache.eth.getAccounts();
      setGanacheAC(_ganacheAC.slice(1));

      const _contract = new web3.eth.Contract(
        Contract.abi,
        Contract.networks[5777].address
      );
      setContract(_contract);

      await fetchRequests(_contract);
      await updateBalance(web3, _contract);

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <img className="bg-image" src={Green} alt="Loading..." />
      <div className="d-flex flex-column relative h-100">
        <div className="container-fluid h-100 containerDiv">
          <div
            id="modalDiv"
            className="col-lg-6 d-flex align-items-center flex-column m-auto h-100 w-100"
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                <Header account={account} />
                <div
                  id="mainContent"
                  className="d-flex align-items-center flex-column w-100"
                >
                  <Divider>
                    <div className="align-items-center d-flex">
                      RSU Balance: {balance ?? "..."} ETH{" "}
                      <Button
                        type="link"
                        shape="circle"
                        icon={<HiOutlineRefresh />}
                        onClick={() => updateBalance(web3Provider, contract)}
                        style={{ color: "black" }}
                      />
                    </div>
                  </Divider>

                  <div className="d-flex justify-content-between align-items-center w-100 px-4">
                    <Button
                      shape="round"
                      size="large"
                      type="primary"
                      onClick={() => setAddRequestModalVisible(true)}
                    >
                      Add Request
                    </Button>
                    <Button
                      shape="round"
                      size="large"
                      type="primary"
                      onClick={() => setAddDataModalVisible(true)}
                    >
                      Add Data
                    </Button>
                  </div>
                  <Divider>Requests List - Count: {requestCount}</Divider>
                  <RequestsList requests={requests} />
                </div>
              </>
            )}
          </div>
          <RequestModal
            isModalVisible={addRequestModalVisible}
            closeModal={() => setAddRequestModalVisible(false)}
            addRequest={addRequest}
          />
          <DataModal
            isModalVisible={addDataModalVisible}
            closeModal={() => setAddDataModalVisible(false)}
            requests={requests}
            addData={addData}
            addresses={ganacheAC}
          />
        </div>
      </div>
    </>
  );
};

export default App;
