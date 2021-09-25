import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
// utils
import { ticketDevicesReport } from '../../../../utils/ticketHandlers';

const styles = StyleSheet.create({
  subtitle2: { fontSize: 9, fontWeight: 700 },
  ticketDevicesContainer: {
    marginTop: '40px',
    flexDirection: 'column'
  },
  title: { fontSize: 13, fontWeight: 500 },
  tableContainter: {
    marginTop: '25px'
  },
  table: { display: 'flex', width: 'auto' },
  tableHeader: {},
  tableBody: {},
  collapsibleRow: { flexDirection: 'column' },
  tableRow: {
    padding: '8px 0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8'
  },
  tableCell_1: { width: '15%' },
  tableCell_2: { width: '70%', paddingRight: 16 },
  tableCell_3: { width: '15%' },
  collpasibleCell: { width: '25%' },
  noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
  alignRight: { textAlign: 'right' },
  pricingContainer: {
    marginTop: '20px'
  }
});

TicketDevices.propTypes = {
  ticketDevices: PropTypes.array,
  ticketDetails: PropTypes.array
};

function TicketDevices({ ticketDevices, ticketDetails }) {
  const [ticketDevicesData, setTicketDevicesData] = useState([]);
  useEffect(() => {
    ticketDevicesReport(ticketDevices).then((reportData) => setTicketDevicesData(reportData));
  }, [ticketDevices]);
  return (
    <View style={styles.ticketDevicesContainer}>
      <Text style={styles.title}>Ticket devices</Text>
      <View style={styles.tableContainter}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={[styles.subtitle2]}>#</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Issue</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Type</Text>
              </View>
            </View>
          </View>
          <View style={styles.tableBody}>
            {ticketDevicesData.map((ticketDevice) => (
              <View style={styles.collapsibleRow} key={ticketDevice.id}>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell_1}>
                    <Text style={styles.subtitle2}>{ticketDevice.id}</Text>
                  </View>
                  <View style={styles.tableCell_2}>
                    <Text>{ticketDevice.issue}</Text>
                  </View>
                  <View style={styles.tableCell_3}>
                    <Text>{ticketDevice.ticketType}</Text>
                  </View>
                </View>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    marginTop: '20px',
                    marginBottom: '20px'
                  }}
                >
                  Spareparts&amp;Services
                </Text>
                {ticketDevice.collapsibleData.length !== 0 ? (
                  <View style={styles.collapsibleContent}>
                    <View style={styles.tableHeader}>
                      <View style={styles.tableRow}>
                        <View style={styles.collpasibleCell}>
                          <Text style={styles.subtitle2}>Description</Text>
                        </View>
                        <View style={styles.collpasibleCell}>
                          <Text style={styles.subtitle2}>QTY</Text>
                        </View>
                        <View style={styles.collpasibleCell}>
                          <Text style={styles.subtitle2}>Price</Text>
                        </View>
                        <View style={styles.collpasibleCell}>
                          <Text style={styles.subtitle2}>Sum</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.tableBody}>
                      {ticketDevice.collapsibleData.map((collapsibleRow, index) => (
                        <View style={styles.tableRow} key={index}>
                          <View style={styles.collpasibleCell}>
                            <Text>{collapsibleRow.description}</Text>
                          </View>
                          <View style={styles.collpasibleCell}>
                            <Text>{collapsibleRow.qty}</Text>
                          </View>
                          <View style={styles.collpasibleCell}>
                            <Text>{collapsibleRow.price}</Text>
                          </View>
                          <View style={styles.collpasibleCell}>
                            <Text>{collapsibleRow.sum}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : (
                  <Text style={{ alignSelf: 'center', fontSize: 9, fontWeight: 700 }}>No data available</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.pricingContainer}>
        <View style={[styles.tableRow, styles.noBorder]}>
          <View style={styles.tableCell_1} />
          <View style={styles.tableCell_2} />
          <View style={styles.tableCell_3} />
          <View style={styles.tableCell_3}>
            <Text style={styles.subtitle2}>Subtotal</Text>
          </View>
          <View style={[styles.tableCell_3, styles.alignRight]}>
            <Text>{ticketDetails.total_cost} EGP</Text>
          </View>
        </View>

        <View style={[styles.tableRow, styles.noBorder]}>
          <View style={styles.tableCell_1} />
          <View style={styles.tableCell_2} />
          <View style={styles.tableCell_3} />
          <View style={styles.tableCell_3}>
            <Text style={styles.subtitle2}>Discount</Text>
          </View>
          <View style={[styles.tableCell_3, styles.alignRight]}>
            <Text>...</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default TicketDevices;
