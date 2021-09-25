import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: { flexDirection: 'column', marginTop: '40px' },
  ticketContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: '25px'
  },
  columnContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  title: { fontSize: 13, fontWeight: 500 },
  body1: {
    fontSize: 10,
    fontWeight: 500
  }
});

Ticket.propTypes = {
  ticketDetails: PropTypes.object
};

function Ticket({ ticketDetails }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ticket info</Text>
      <View style={styles.ticketContainer}>
        <View style={styles.columnContainer}>
          <Text style={styles.body1}>{ticketDetails.client_name}</Text>
          <Text style={styles.body1}>{ticketDetails.client_address}</Text>
          <Text
            style={styles.body1}
          >{`${ticketDetails.client_phone_number_1}, ${ticketDetails.client_phone_number_2}, ${ticketDetails.client_landline_number} `}</Text>
          <Text style={styles.body1}>{`${ticketDetails.client_city}, ${ticketDetails.client_region}`}</Text>
          <Text
            style={styles.body1}
          >{`${ticketDetails.client_address}, ${ticketDetails.client_building_no}, ${ticketDetails.client_apartment_no}, ${ticketDetails.client_floor_no}`}</Text>
          <Text style={styles.body1}>{ticketDetails.client_landmark}</Text>
        </View>
        <View style={styles.columnContainer}>
          <Text style={styles.body1}>{ticketDetails.client_category}</Text>
          <Text style={styles.body1}>{ticketDetails.technician_name}</Text>
          <Text style={styles.body1}>{ticketDetails.total_cost} EGP</Text>
        </View>
      </View>
    </View>
  );
}

export default Ticket;
