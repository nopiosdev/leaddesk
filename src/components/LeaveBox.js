import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'

const LeaveBox = ({ item, onApprove, onReject, styles }) => {
    const user = useSelector((state) => state.user.currentUser);

    return (
        <View
            style={styles.listContainer}
        >
            <View style={styles.listInnerContainer}>
                <Text style={styles.leaveType}>
                    Name:
                </Text>
                <Text style={styles.leaveFrom}>
                    From:
                </Text>
            </View>

            <View style={styles.leaveReasonContainer}>
                <Text
                    style={styles.leaveReasonText}>
                    {item.EmployeeName}
                </Text>
                <Text
                    style={styles.reasonFromDate}>
                    {moment(item.FromDate).format('DD/MM/YYYY')}
                </Text>
            </View>

            <View
                style={styles.causeContainer}>
                <Text
                    style={styles.causeText}>
                    Cause:
                </Text>
                <Text
                    style={styles.leaveToText}>
                    To:
                </Text>
            </View>

            <View
                style={styles.detailsContainer}>
                <Text
                    style={styles.detailsText}>
                    {item.LeaveReason}
                </Text>
                <Text
                    style={styles.detailsTextInner}>
                    {moment(item.ToDate).format('DD/MM/YYYY')}
                </Text>
            </View>

            <View
                style={styles.causeContainer1}>
                <Text style={styles.causeText}>
                    Leave Type:
                </Text>
                <Text style={styles.causeText1}>
                    {item.LeaveTypeId === 1 && 'Casual Leave'}
                    {item.LeaveTypeId === 2 && 'Sick Leave'}
                </Text>
            </View>


            {(item.ApprovedBy != null && item.ApprovedBy != '') &&
                <View
                    style={styles.approvedByContainer}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text
                            style={styles.approvedByText}>
                            Approved By:
                        </Text>
                        <Text
                            style={styles.approvedByText1}>
                            {item.ApprovedBy}

                        </Text>
                    </View>
                    <View>
                        <Text
                            style={styles.approvedAtText}>
                            Approved At:
                        </Text>
                        <Text
                            style={styles.approvedAtText1}>
                            {moment(item.ApprovedAt).format('DD/MM/YYYY')}
                        </Text>
                    </View>
                </View>
            }

            {(!item.IsApproved && !item.IsRejected && user.UserType == 'admin') ?
                <View
                    style={styles.buttonContainer}>
                    <View style={styles.foraligmentitem}>
                        <TouchableOpacity
                            onPress={onApprove}
                            style={styles.buttonTouchable}>
                            <Text style={styles.approveText}>
                                APPROVE
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onReject}
                            style={styles.rejectButtonTouchable}>
                            <Text
                                style={styles.rejectText}>
                                REJECT
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.statusDate1}>
                        {item?.leaveInDays} Day{item?.leaveInDays > 1 ? "s" : ""}
                    </Text>
                </View>
                :
                <View
                    style={styles.statusButton}>
                    <View
                        style={styles.statusButtonInner}>
                        {item.IsApproved === 1 ?
                            (<Text style={{ color: 'green', }}>
                                Approved
                            </Text>)
                            : (item.IsRejected === 1 ?
                                (<Text style={{ color: 'red', }}>
                                    Rejected
                                </Text>)
                                : (<Text style={{ color: '#f1b847', }}>
                                    Pending
                                </Text>))}

                    </View>

                    <Text
                        style={styles.statusDate}>
                        {item?.leaveInDays} Days
                    </Text>
                </View>
            }
        </View>
    )
}

export default LeaveBox