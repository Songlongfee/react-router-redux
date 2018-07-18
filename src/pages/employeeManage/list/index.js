import React, { Component } from "react";
import "./index.css";
import { Form, Button, Input, Table, Modal, message, DatePicker, Select } from "antd";
import Api from "../../../request.js";
import { postPageHeight } from "../../../utils/index";

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
      dept: [], //全部部门列表
      roles: [] //全部角色列表
    };
  }
  getEmployeeList = params => {
    this.props.getEmployeeList(params);
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
        userName: fieldsValue["userName"] || "",
        mobile: fieldsValue["mobile"],
        job: fieldsValue["job"],
        startTime: fieldsValue["startTime"]
          ? fieldsValue["startTime"].format("YYYY-MM-DD HH:mm:ss")
          : null,
        endTime: fieldsValue["endTime"]
          ? fieldsValue["endTime"].format("YYYY-MM-DD HH:mm:ss")
          : null
      };
      this.getEmployeeList(values);
    });
  };

  componentDidMount() {
    //部门列表
    Api.post(`employee/getDeptList`, {
      bussType: 1 //当前后台类型
    }).then(res => {
      if (res.data.status === 1) {
        this.setState({ dept: res.data.body.deptList });
      } else {
        message.error(res.data.msg);
      }
    });
    //角色列表
    Api.post(`role/getBussRoleList`, {
      bussId: 123321, //钱包id
      userId: 10000000
    }).then(res => {
      if (res.data.status === 0) {
        this.setState({ roles: res.data.body.roleList });
      } else {
        message.error(res.data.msg);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const nameConfig = {
      rules: [{ type: "string", required: false, message: "请输入员工姓名" }]
    };
    const mobileConfig = {
      rules: [{ type: "string", required: false, message: "请输入手机号码" }]
    };
    const jobsConfig = {
      rules: [{ type: "string", required: false, message: "请输入岗位名称" }]
    };
    const startTimeConfig = {
      rules: [
        { type: "object", required: false, message: "请选择查询起始时间" }
      ]
    };
    const endTimeConfig = {
      rules: [
        { type: "object", required: false, message: "请选择查询结束时间" }
      ]
    };
    const deptConfig = {
      rules: [
        { type: "string", required: false, message: "请选择所属部门" }
      ]
    };
    const roleConfig = {
      rules: [
        { type: "string", required: false, message: "请选择角色" }
      ]
    };
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem label="手机号码" className="label" >
          {getFieldDecorator("mobile", mobileConfig)(
            <Input type="text" style={{ width: "180px" }} />
          )}
        </FormItem>
        <FormItem label="姓名" className="label" >
          {getFieldDecorator("userName", nameConfig)(
            <Input type="text" style={{ width: "180px" }} />
          )}
        </FormItem>
        <FormItem label="创建时间" className="label">
          <FormItem>
            {getFieldDecorator("startTime", startTimeConfig)(
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="" style={{ width: "180px" }}/>
            )}
          </FormItem>
          <span className="to">至</span>
          <FormItem>
            {getFieldDecorator("endTime", endTimeConfig)(
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="" style={{ width: "180px" }}/>
            )}
          </FormItem>
        </FormItem>
        <FormItem label="岗位名称" className="label" >
          {getFieldDecorator("job", jobsConfig)(
            <Input type="text" style={{ width: "180px" }} />
          )}
        </FormItem>
        <FormItem label="所属部门" className="label" >
          {getFieldDecorator("dept", deptConfig)(
            <Select
              style={{ width: "180px" }}
            >
              {this.state.dept.map(item => (
                <Option
                  key={item.deptId}
                  value={item.deptId.toString()}
                >
                  {item.deptName}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="角色" className="label" >
          {getFieldDecorator("role", roleConfig)(
            <Select
              style={{ width: "180px" }}
            >
              {this.state.roles.map(item => (
                <Option
                  key={item.roleId}
                  value={item.roleId.toString()}
                >
                  {item.roleName}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const SearchForm = Form.create()(Search);

class EmployeeManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleColumns: [
        { title: "手机号码", dataIndex: "mobile", key: "mobile" },
        { title: "姓名", dataIndex: "userName", key: "userName" },
        { title: "所属部门", dataIndex: "dept", key: "dept" },
        { title: "岗位名称", dataIndex: "jobs", key: "jobs" },
        { title: "角色", dataIndex: "roles", key: "roles" },
        { title: "备注", dataIndex: "remark", key: "remark" },
        { title: "添加时间", dataIndex: "addTime", key: "addTime" },
        { title: "操作", key: "action", render: (text, record) => (
          <span>
            <a onClick={() => this.editEmployee(record)}>查看详情</a>
          </span>
        )}
      ],
      employeeTable: [],
      selectList: [], //选中的员工id
      pageSize: 10,
      pageNow: 1,
      postData: {}
    };
    this.getEmployeeList = this.getEmployeeList.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
  }

  getEmployeeList(params) {
    // 获取员工列表
    this.setState({ queryData: params });
    Api.post("employee/getEmployeeList", {
      ...params,
      bussType: 1,
      pageSize: this.state.pageSize,
      pageNow: this.state.pageNow || 1
    })
      .then(res => {
        this.setState({
          employeeTable: res.data.body.employeeList.map(item => ({
            ...item,
            jobs: item.jobList.join(","),
            roles: item.roleList.join(","),
            key: item.relationId.toString()
          })),
          pageNow: res.data.body.pageNow,
          totalCount: res.data.body.totalCount
        });
        postPageHeight()
      })
      .catch(err => {
        console.log(err);
        postPageHeight()
      });
  }
  EmployeePageChange(params) {
    // 员工列表翻页
    let queryData = this.state.queryData;
    Api.post("employee/getEmployeeList", { ...params, ...queryData })
      .then(res => {
        this.setState({
          employeeTable: res.data.body.employeeList.map(item => ({
            ...item,
            jobs: item.jobList.join(","),
            roles: item.roleList.join(","),
            key: item.relationId.toString()
          })),
          pageNow: res.data.body.pageNow,
          totalCount: res.data.body.totalCount
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  onShowSizeChange(params) {
    let queryData = this.state.queryData;
    Api.post("employee/getEmployeeList", {
      ...params,
      ...queryData,
      bussType: 1
    })
      .then(res => {
        this.setState({
          employeeTable: res.data.body.employeeList.map(item => ({
            ...item,
            jobs: item.jobList.join(","),
            roles: item.roleList.join(","),
            key: item.relationId.toString()
          })),
          pageNow: res.data.body.pageNow,
          totalCount: res.data.body.totalCount
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  toAddEmployee() {
    this.props.history.push(`/add-employee`)
  }
  // 查看编辑员工
  editEmployee(params) {
    console.log(params);
    this.props.history.push(`/edit-employee?${params.relationId}`);
  }
  // 删除员工
  deleteEmployee(params) {
    let that = this;
    let pageSize = this.state.pageSize;
    let list = this.state.selectList;
    if (list.length < 1) {
      message.warn("请选择要删除的员工");
      return;
    }
    confirm({
      title: "提示",
      content: "确认删除所选员工吗？",
      onOk() {
        Api.post("employee/deleteEmployee", {
          relationIds: list
        }).then(res => {
          if (res.data.status === 1) {
            message.success("删除成功！");
            Api.post("employee/getEmployeeList", {
              pageSize,
              pageNow: 1,
              bussType: 1
            })
              .then(res => {
                that.setState({
                  employeeTable: res.data.body.employeeList.map(item => ({
                    ...item,
                    jobs: item.jobList.join(","),
                    roles: item.roleList.join(","),
                    key: item.relationId.toString()
                  })),
                  pageNow: res.data.body.pageNow,
                  totalCount: res.data.body.totalCount
                });
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            message.error(res.data.msg);
          }
        });
      },
      onCancel() {}
    });
  }
  componentDidMount() {
    // 获取全部角色
    // const that = this;
    // const setData = (data) => {
    //   this.setState({
    //     postData: data
    //   })
    // }
    // window.addEventListener('message', receiveMsg, false) // 监听存储postMessage数据
    // function receiveMsg(event) {
    //   console.log(event.data)
    //   setData(event.data)
    //   if(event.data){
    //     that.getRoleList()
    //   }
    // }
    this.getEmployeeList();
  }

  render() {
    // const rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     console.log(`selectedRowKeys: ${selectedRowKeys}`);
    //     this.setState({ selectList: selectedRowKeys });
    //   },
    //   getCheckboxProps: record => ({
    //     disabled: record.name === "Disabled User",
    //     name: record.name
    //   })
    // };
    return (
      <div className="main">
        <div className="header" style={{display:'none'}}>员工维护</div>
        <div className="form">
          <div className="form-title">
            <div className="left bold">员工查询</div>
            <div className="right">
              {/* <Button onClick={() => this.deleteEmployee()}>删除</Button> */}
              {/* <Button onClick={() => this.editEmployee()}>修改</Button> */}
              <Button onClick={this.toAddEmployee.bind(this)}>添加员工</Button>
            </div>
          </div>
          <div className="form-content">
            <SearchForm getEmployeeList={this.getEmployeeList} />
          </div>
        </div>
        <div className="table fuck-th">
          <div className="title bold">员工查询结果列表</div>
          <Table
            // rowSelection={rowSelection}
            columns={this.state.roleColumns}
            dataSource={this.state.employeeTable}
            pagination={{
              total: this.state.totalCount,
              current: this.state.pageNow,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: (page, pageSize) => {
                this.setState({ pageSize });
                this.rolePageChange({ pageSize: pageSize, pageNow: page });
              },
              onShowSizeChange: (pageNow, pageSize) => {
                this.setState({ pageSize, pageNow });
                this.onShowSizeChange({ pageSize, pageNow });
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default EmployeeManage;
