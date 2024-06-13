import React from 'react';

class FirebaseConnector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form_data: this.props.form_data,
      message: '',
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch('/.netlify/functions/submitForm', {
        method: 'POST',
        body: JSON.stringify(this.state.form_data),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('An error occurred while submitting the form');
      }

      const data = await response.json();
      this.setState({ message: data.message });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <div>
        {this.state.message}
      </div>
    );
  }
}

export default FirebaseConnector;