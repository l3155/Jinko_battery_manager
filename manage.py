#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
@author  张军军[zhangjunjun@aactechnologies.com]
@version 
@since   

-------------------------------------------------
日期   张军军 [Init]         变更履历
-------------------------------------------------

Server管理程序
"""
from flask_script import Manager, Server
from main import app

manager = Manager(app)
manager.add_command("server", Server)


@manager.shell
def make_shell_context():
    return dict(app=app)

if __name__ == "__main__":
    manager.run()