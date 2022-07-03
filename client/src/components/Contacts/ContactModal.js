import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import { connect } from "react-redux";
import { addContact } from "../../actions/contactActions";
import { clearErrors } from "../../actions/errorActions";
import PropTypes from "prop-types";
import { FaUserPlus, FaEthereum } from "react-icons/fa";

class ContactModal extends Component {
  state = {
    showModal: false,
    contactName: "",
    hexAddress: "",
    msg: null,
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    addContact: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    isAdded: PropTypes.bool,
  };

  componentDidUpdate(prevProps) {
    const { error, isAdded } = this.props;
    if (error !== prevProps.error) {
      // Check for add contact error
      if (error.id === "ADD_CONTACT_FAIL") {
        this.setState({ msg: error?.msg?.message });
      } else {
        this.setState({ msg: null });
      }
    }

    // If isAdded, close modal
    if (this.state.showModal) {
      if (isAdded) {
        this.toggle();
        window.location.reload(false);
      }
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();

    this.setState({
      showModal: !this.state.showModal,
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { contactName, hexAddress } = this.state;

    const newContact = {
      contactName,
      hexAddress,
    };

    // Attempt to add the new contact
    this.props.addContact(newContact);

    this.setState({
      contactName: "",
      hexAddress: "",
    });
  };

  render() {
    return (
      <div>
        <Button
          color="dark"
          style={{
            marginBottom: "2rem",
            position: "relative",
            zIndex: (this.state.modal == false ? "10000" : "0"),
          }}
          onClick={this.toggle}
          type="button"
        >
          Add Contact <FaUserPlus />
        </Button>

        {this.state.showModal == true && (
          <Modal isOpen={this.state.showModal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>
              Add Trusted Contact to your agenda
            </ModalHeader>
            <ModalBody>
              {this.state.msg ? (
                <Alert color="danger">{this.state.msg}</Alert>
              ) : null}
              <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                  <Label for="contactName">Contact Name</Label>
                  <Input
                    type="text"
                    name="contactName"
                    id="contactName"
                    placeholder="Contact Name"
                    onChange={this.handleChange}
                  />

                  <Label for="hexAddress">Ethereum Address</Label>
                  <Input
                    type="text"
                    name="hexAddress"
                    id="hexAddress"
                    placeholder="0x..."
                    onChange={this.handleChange}
                  />
                  <Button color="dark" style={{ marginTop: "2rem" }} block>
                    Add Contact <FaEthereum />
                  </Button>
                </FormGroup>
              </Form>
            </ModalBody>
          </Modal>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAdded: state.contact.isAdded,
  error: state.error,
});

export default connect(mapStateToProps, { addContact, clearErrors })(
  ContactModal
);
