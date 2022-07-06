import React, { Component } from "react";
import { connect } from "react-redux";
import { Input, Button, Label } from "reactstrap";
import PropTypes from "prop-types";
import { animateScroll } from "react-scroll";
import boi from "../../images/boi.png";
import coinbot from "../../images/coinbot.png";
import { userMessage, botMessage } from "../../actions/chatActions";
import "./Chatbot.css";
import { FaEthereum, FaLock, FaFileUpload } from "react-icons/fa";

class Chatbot extends Component {
  state = {
    message: "",
    ctx: {},
  };

  static propTypes = {
    userMessage: PropTypes.func.isRequired,
    botMessage: PropTypes.func.isRequired,
  };

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "historyContainer",
    });
  }

  send = async () => {
    let ctx = {};

    await this.props.userMessage(this.state.message);

    await this.props.botMessage({
      context: this.state.ctx,
      message: this.state.message,
    });

    ctx = this.props.response.context;
    this.setState({ ctx: ctx });

    this.clearState();
  };

  clearState = () => {
    this.setState({
      message: "",
    });
  };

  render() {
    return ( this.props.show &&
      <div id="chat">
        <div className="conv-head">
          <img className="conv-icon" alt="bot" src={coinbot} />
          <h4 className="conv-title">
            Wally - Your WalletBot <FaEthereum />
          </h4>
          <span className="conv-info">
            End-To-End Encrypted Channel <FaLock />
          </span>
        </div>
        <hr className="delimiter"></hr>
        <div id="historyContainer">
          {this.props.messages.length === 0
            ? ""
            : this.props.messages.map((msg, index) => (
                <div key={index} className={msg.type}>
                  {msg.type === "bot" ? (
                    <div>
                      <img className="chat-icon" alt="bot" src={coinbot} />
                      <div>{msg.message.response}</div>
                    </div>
                  ) : (
                    <div>
                      <img className="chat-icon" alt="user" src={boi} />
                      <div>{msg.message}</div>
                    </div>
                  )}
                </div>
              ))}
        </div>
        <Input
          type="text"
          name="message"
          id="message"
          placeholder="Text Message"
          onChange={this.handleChange}
          value={this.state.message}
          style={{ width: "328px", marginLeft: "20px" }}
        />
        <Button
          color="success"
          size="sm"
          id="send-msg"
          onClick={() => this.send()}
          style={{ marginLeft: "360px", marginTop: "-67px", height: "2.2rem", marginRight: "0.5rem" }}
        >
          Send
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error,
  response: state.chat.response,
  messages: state.chat.messages,
});

export default connect(mapStateToProps, {
  userMessage,
  botMessage,
})(Chatbot);
