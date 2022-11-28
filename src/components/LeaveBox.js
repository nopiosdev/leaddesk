import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { LeaveListStyle } from '../Screen/AdminScreens/leaves/LeaveListStyle'
import moment from 'moment'
import { useSelector } from 'react-redux'

const LeaveBox = ({ item, onApprove, onReject }) => {
    const user = useSelector((state) => state.user.currentUser);
// console.log(new Date(item.ToDate.replace(/-/g,'/')) - new Date(item.FromDate.replace(/-/g,'/')))
    return (
        <View
            style={LeaveListStyle.listContainer}
        >
            <View style={LeaveListStyle.listInnerContainer}>
                <Text style={LeaveListStyle.leaveType}>
                    Name:
                </Text>
                <Text style={LeaveListStyle.leaveFrom}>
                    From:
                </Text>
            </View>

            <View style={LeaveListStyle.leaveReasonContainer}>
                <Text
                    style={LeaveListStyle.leaveReasonText}>
                    {item.EmployeeName}
                </Text>
                <Text
                    style={LeaveListStyle.reasonFromDate}>
                    {moment(item.FromDate).format('DD/MM/YYYY')}
                </Text>
            </View>

            <View
                style={LeaveListStyle.causeContainer}>
                <Text
                    style={LeaveListStyle.causeText}>
                    Cause:
                </Text>
                <Text
                    style={LeaveListStyle.leaveToText}>
                    To:
                </Text>
            </View>

            <View
                style={LeaveListStyle.detailsContainer}>
                <Text
                    style={LeaveListStyle.detailsText}>
                    {item.LeaveReason}
                </Text>
                <Text
                    style={LeaveListStyle.detailsTextInner}>
                    {moment(item.ToDate).format('DD/MM/YYYY')}
                </Text>
            </View>

            <View
                style={LeaveListStyle.causeContainer1}>
                <Text style={LeaveListStyle.causeText}>
                    Leave Type:
                </Text>
                <Text style={LeaveListStyle.causeText1}>
                    {item.LeaveTypeId === 1 && 'Casual Leave'}
                    {item.LeaveTypeId === 2 && 'Sick Leave'}
                </Text>
            </View>


            {(item.ApprovedBy != null && item.ApprovedBy != '') &&
                <View
                    style={LeaveListStyle.approvedByContainer}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text
                            style={LeaveListStyle.approvedByText}>
                            Approved By:
                        </Text>
                        <Text
                            style={LeaveListStyle.approvedByText1}>
                            {item.ApprovedBy}

                        </Text>
                    </View>
                    <View>
                        <Text
                            style={LeaveListStyle.approvedAtText}>
                            Approved At:
                        </Text>
                        <Text
                            style={LeaveListStyle.approvedAtText1}>
                            {moment(item.ApprovedAt).format('DD/MM/YYYY')}
                        </Text>
                    </View>
                </View>
            }

            {(!item.IsApproved && !item.IsRejected && user.UserType == 'admin') ?
                <View
                    style={LeaveListStyle.buttonContainer}>
                    <View style={LeaveListStyle.foraligmentitem}>
                        <TouchableOpacity
                            onPress={onApprove}
                            style={LeaveListStyle.buttonTouchable}>
                            <Text style={LeaveListStyle.approveText}>
                                APPROVE
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onReject}
                            style={LeaveListStyle.rejectButtonTouchable}>
                            <Text
                                style={LeaveListStyle.rejectText}>
                                REJECT
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={LeaveListStyle.statusDate1}>
                        {item?.leaveInDays} Days
                    </Text>
                </View>
                :
                <View
                    style={LeaveListStyle.statusButton}>
                    <View
                        style={LeaveListStyle.statusButtonInner}>
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
                        style={LeaveListStyle.statusDate}>
                        {item?.leaveInDays} Days
                    </Text>
                </View>
            }
        </View>
    )
}

export default LeaveBox