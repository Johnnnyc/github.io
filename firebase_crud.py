#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Firebase CRUD 操作示例
功能：向Firebase实时数据库读写数据
"""

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db


def initialize_firebase():
    """
    初始化Firebase连接
    需要先下载serviceAccountKey.json文件并放入指定路径
    """
    try:
        # 加载服务账号密钥文件
        cred = credentials.Certificate("F:\上位机软件\own\myselfweb\esp32-sensor-data-ed101-firebase-adminsdk-fbsvc-2eb6b29bcb.json")
        
        # 初始化Firebase应用
        # databaseURL是你的Firebase数据库URL
        firebase_admin.initialize_app(cred, {
            'databaseURL': 'https://your-project-id.firebaseio.com'
        })
        print("Firebase初始化成功")
        return True
    except Exception as e:
        print(f"Firebase初始化失败: {e}")
        return False


def write_data():
    """
    向Firebase写入数据
    """
    try:
        # 获取数据库引用
        ref = db.reference()
        
        # 写入用户数据
        users_ref = ref.child('users')
        users_ref.set({
            'user1': {
                'name': 'John Doe',
                'email': 'john@example.com',
                'age': 30
            },
            'user2': {
                'name': 'Jane Smith',
                'email': 'jane@example.com',
                'age': 25
            }
        })
        print("数据写入成功")
    except Exception as e:
        print(f"数据写入失败: {e}")


def read_data():
    """
    从Firebase读取数据
    """
    try:
        # 获取数据库引用
        ref = db.reference('users')
        
        # 读取所有用户数据
        users = ref.get()
        if users:
            print("读取到的用户数据:")
            for user_id, user_data in users.items():
                print(f"用户ID: {user_id}")
                print(f"  姓名: {user_data.get('name')}")
                print(f"  邮箱: {user_data.get('email')}")
                print(f"  年龄: {user_data.get('age')}")
                print()
        else:
            print("未找到用户数据")
    except Exception as e:
        print(f"数据读取失败: {e}")


def update_data():
    """
    更新Firebase中的数据
    """
    try:
        # 获取数据库引用
        ref = db.reference('users/user1')
        
        # 更新用户数据
        ref.update({
            'age': 31,
            'email': 'john.doe@example.com'
        })
        print("数据更新成功")
    except Exception as e:
        print(f"数据更新失败: {e}")


def delete_data():
    """
    从Firebase删除数据
    """
    try:
        # 获取数据库引用
        ref = db.reference('users/user2')
        
        # 删除用户数据
        ref.delete()
        print("数据删除成功")
    except Exception as e:
        print(f"数据删除失败: {e}")


def write_single_value():
    """
    写入单个值
    """
    try:
        # 获取数据库引用
        ref = db.reference('last_updated')
        
        # 写入单个值
        import datetime
        current_time = datetime.datetime.now().isoformat()
        ref.set(current_time)
        print(f"写入时间戳成功: {current_time}")
    except Exception as e:
        print(f"写入单个值失败: {e}")


if __name__ == "__main__":
    # 初始化Firebase
    if initialize_firebase():
        # 执行CRUD操作
        print("=== 写入数据 ===")
        write_data()
        
        print("\n=== 读取数据 ===")
        read_data()
        
        print("\n=== 更新数据 ===")
        update_data()
        
        print("\n=== 读取更新后的数据 ===")
        read_data()
        
        print("\n=== 写入单个值 ===")
        write_single_value()
        
        print("\n=== 删除数据 ===")
        delete_data()
        
        print("\n=== 读取删除后的数据 ===")
        read_data()
