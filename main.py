#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
@author  张军军[zhangjunjun@aactechnologies.com]
@version 
@since   

-------------------------------------------------
日期   张军军 [Init]         变更履历
-------------------------------------------------

主程序控制台
"""
import json
from flask import Flask
from flask import request
from flask import jsonify
from flask import render_template
from config import DecConfig
from data import raw_data
from datetime import datetime,timedelta

app = Flask(__name__)
app.config.from_object(DecConfig)


@app.route('/alarm')
def get_alarm_page():
    return render_template('alarm.html')


@app.route('/real_time')
def get_real_time_page():
    return render_template('real_time.html')


@app.route('/report')
def get_report_page():
    return render_template('report.html')


@app.route('/battery_setting')
def battery_setting_page():
    return render_template('battery_setting.html')


@app.route('/get_receiver', methods=['GET', 'POST'])
def get_receiver():
    #################################################################
    receivers = raw_data.load_data('data/receiver.json')
    #################################################################
    return jsonify(receivers)


@app.route('/get_alarm_data', methods=['GET', 'POST'])
def get_alarm_data():
    receiver = request.args.get('receiver')
    #################################################################
    receivers = raw_data.load_data('data/alarm.json')
    if receiver == "all":
        return jsonify(receivers)
    else:
        data = [i for i in receivers['data'] if i['receiver'] == receiver]
        receivers['data'] = data
        #################################################################
        return jsonify(receivers)


@app.route('/get_real_time_data', methods=['GET', 'POST'])
def get_real_time_data():
    receiver = request.args.get('receiver')
    #################################################################
    receivers = raw_data.load_data('data/real_time.json')
    data = [i for i in receivers['data'] if i['receiver'] == receiver]
    receivers['data'] = data
    #################################################################
    return jsonify(receivers)


@app.route('/battery_details', methods=['GET', 'POST'])
def get_battery_details():
    battery = request.args.get('battery')
    start_time = request.args.get('start')
    end_time = request.args.get('end')
    """
    如果未收到start_time和end_time，可自定义搜索时间
    """
    #################################################################
    battery_details = raw_data.load_data('data/battery_detail.json')
    #################################################################
    return jsonify(battery_details)

"""
# 用于电池详情搜索测试
@app.route('/battery_details2', methods=['GET', 'POST'])
def get_battery_details2():
    battery_id = request.args.get('battery_id')
    start_time = request.args.get('start')
    end_time = request.args.get('end')
    #################################################################
    battery_details = raw_data.load_data('data/battery_detail2.json')
    #################################################################
    return jsonify(battery_details)
"""


@app.route('/get_report', methods=['GET', 'POST'])
def get_report():
    receiver = request.args.get('receiver')
    start_time = request.args.get('start')
    end_time = request.args.get('end')
    #################################################################
    report = raw_data.load_data('data/report.json')
    #################################################################
    return jsonify(report)


@app.route('/get_battery_setting', methods=['GET', 'POST'])
def get_battery_setting():
    battery_setting_data = raw_data.load_data('data/battery_setting.json')
    return jsonify(battery_setting_data)


@app.route('/save_battery_setting', methods=['GET', 'POST'])
def save_battery_setting():
    receiver = request.args.get('receiver')
    receiver_sn = request.args.get('receiver_sn')
    temp_lower = request.args.get('tempLower')
    temp_upper = request.args.get('tempUpper')
    voltage_lower = request.args.get('voltageLower')
    voltage_upper = request.args.get('voltageUpper')
    battery_setting_data = raw_data.load_data('data/battery_setting.json')
    return jsonify(battery_setting_data)


@app.route('/delete_battery_setting', methods=['GET', 'POST'])
def delete_battery_setting():
    receiver_sn = request.args.get('receiver_sn')
    battery_setting_data = raw_data.load_data('data/battery_setting.json')
    return jsonify(battery_setting_data)
