import React, { Component } from "react";
import { Container, ListGroup, ListGroupItem, Button } from "reactstrap";
import { connect } from "react-redux";
import { getContacts, removeContact } from "../../actions/contactActions";
import PropTypes from "prop-types";
import ContactModal from "./ContactModal";
import "./ContactList.css";
import { FaEthereum, FaUserShield, FaCopy } from "react-icons/fa";

class ContactList extends Component {
  state = {
    isCopied: false,
    currentId: "",
  };

  static propTypes = {
    getContacts: PropTypes.func.isRequired,
    contact: PropTypes.object.isRequired,
    removeContact: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };

  componentDidMount() {
    this.props.getContacts();
  }

  componentDidUpdate(prevState) {
    if (
      this.state.isCopied != prevState.isCopied &&
      this.state.isCopied == true
    )
      setTimeout(() => {
        this.setState({
          isCopied: false,
          currentId: "",
        });
      }, 1500);
  }

  onRemoveClick = (contactId) => {
    this.props.removeContact(contactId);
  };

  copyToClipboard = (hexAddress, contactId) => {
    navigator.clipboard.writeText(hexAddress);

    this.setState({
      isCopied: true,
      currentId: contactId,
    });
  };

  render() {
    const { contacts } = this.props.contact;
    const { isAuthenticated } = this.props;

    return isAuthenticated ? (
      contacts.length > 0 ? (
        <div className="agenda-contacts-wrapper">
          <h3>Your Trusted Contacts Agenda</h3>
          <ContactModal />
          <Container className="agenda-contacts-section">
            <ListGroup className="contact-list">
              {contacts.map(({ contactId, contactName, hexAddress }) => (
                <ListGroupItem key={contactId} className="contact-info">
                  <div className="info-container">
                    <span>
                      <FaUserShield /> {contactName}
                    </span>
                    <span>
                      <FaEthereum />
                      {hexAddress.slice(0, 10) + "..." + hexAddress.slice(-10)}
                      <FaCopy
                        className="copy-icon"
                        onClick={this.copyToClipboard.bind(
                          this,
                          hexAddress,
                          contactId
                        )}
                      />
                      {this.state.isCopied && this.state.currentId == contactId
                        ? "copied!"
                        : null}
                    </span>
                  </div>
                  <Button
                    className="remove-btn"
                    color="danger"
                    size="sm"
                    onClick={this.onRemoveClick.bind(this, contactId)}
                  >
                    &times;
                  </Button>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Container>
        </div>
      ) : (
        <div className="empty-contacts-wrapper">
          <ContactModal />
          <div className="empty-contacts-section">
            Your contacts agenda is empty
          </div>
        </div>
      )
    ) : (
      <div className="guest-message">
        Please <a href="/login">login</a> in order to see your contacts agenda or add new contacts
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  contact: state.contact,
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, { getContacts, removeContact })(
  ContactList
);
