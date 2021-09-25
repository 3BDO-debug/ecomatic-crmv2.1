import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Document, Page, Font, View, Image, Text } from '@react-pdf/renderer';
// components
import Ticket from './Ticket';
import TicketDevices from './TicketDevices';

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }]
});

const styles = StyleSheet.create({
  page: {
    padding: '40px 24px 0 24px',
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Roboto',
    backgroundColor: '#fff',
    textTransform: 'capitalize'
  },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  h3: { fontSize: 16, fontWeight: 700 },
  subtitle2: { fontSize: 9, fontWeight: 700 }
});

TicketDoc.propTypes = {
  ticketDetails: PropTypes.object,
  ticketDevices: PropTypes.array
};

function TicketDoc({ ticketDetails, ticketDevices }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.gridContainer}>
          <Image source="/static/brand/logo_full.jpg" style={{ height: 32 }} />
          <View style={{ alignItems: 'right', flexDirection: 'column' }}>
            <Text style={styles.h3}>{ticketDetails.ticket_generated_id}</Text>
            <Text style={styles.subtitle2}>{new Date(ticketDetails.created_at).toLocaleString()}</Text>
          </View>
        </View>
        <Ticket ticketDetails={ticketDetails} />
        <TicketDevices ticketDevices={ticketDevices} ticketDetails={ticketDetails} />
      </Page>
    </Document>
  );
}

export default TicketDoc;
