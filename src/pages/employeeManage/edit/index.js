import React, { Component } from "react";
import "./index.css";
import { Form, Input, Select, Button, message, Modal } from "antd";
import Api from "../../../request.js";
import { postPageHeight } from "../../../utils/index";

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const confirm = Modal.confirm;

class EditEmployeeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dept: [],
      roles: [],
      employeeDetail: {
        deptList: [],
        EmployeeMessage: {},
        roleList: []
      }
    }; //全部部门列表 //全部角色列表 //员工详情
  }
  handleSubmit = e => {
    // 提交表单
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        // ...fieldsValue,
        mobile: fieldsValue["mobile"],
        userName: fieldsValue["userName"],
        // deptId: fieldsValue["deptId"],
        roleId: Number(fieldsValue["roleId"] || this.state.roleId),
        remark: fieldsValue["remark"],
        relationId: this.state.employeeDetail.EmployeeMessage.relationId,
        deptList: [
          {
            ...this.state.dept.filter(
              item => item.deptId.toString() === fieldsValue["deptId"]
            )[0],
            job: fieldsValue["job"]
          }
        ]
        // enterpriseId: 1001,
        // userId: 12492521,
        // bussType: 1,
        // bussId: 2546
      };
      console.log(values);
      this.EditEmployee(values);
    });
  };
  EditEmployee(params) {
    // 编辑员工保存
    Api.post(`employee/addOrEditEmployee/`, params).then(res => {
      if (res.data.status === 1) {
        message.success("修改成功");
        this.setState({ roots: [] });
      } else {
        message.error(res.data.msg);
      }
    });
  }
  deleteEmployee(params) {
    let that = this;
    confirm({
      title: "提示",
      content: "确认删除所选员工吗？",
      onOk() {
        Api.post("employee/deleteEmployee", {
          relationIds: [that.state.userId]
        }).then(res => {
          if (res.data.status === 1) {
            message.success("删除成功！");
            window.history.back()
          } else {
            message.error(res.data.msg);
          }
        });
      },
      onCancel() {}
    });
  }
  handleDeptChange(value, option) {}
  handleRoleChange(value) {}
  toAddRole() {
    this.props.history.push(`add-role`);
  }
  componentDidMount() {
    const userId = this.props.location.search.substr(1);
    this.setState({ userId });
    //部门列表
    Api.post(`employee/getDeptList`, {
      bussType: 1
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
    Api.post(`employee/employeeDesc`, {
      relationId: userId
    }).then(res => {
      if (res.data.status === 1) {
        this.setState({
          employeeDetail: res.data.body
          // deptId: res.data.body.employeeJson.deptList[0].deptId,
          // roleId: res.data.body.employeeJson.deptList[0].roleList[0].roleId
        });
      } else {
        message.error(res.data.msg);
      }
    });
    postPageHeight()
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const mobileConfig = {
      rules: [{ type: "number", required: false, message: "请输入手机号码" }],
      initialValue: this.state.employeeDetail.EmployeeMessage.mobile
    };
    const userNameConfig = {
      rules: [{ type: "string", required: true, message: "请输入姓名" }],
      initialValue: this.state.employeeDetail.EmployeeMessage.userName
    };
    const deptConfig = {
      rules: [{ type: "string", required: true, message: "请选择所属部门" }],
      initialValue: String(
        this.state.employeeDetail.deptList[0]
          ? this.state.employeeDetail.deptList[0].deptId
          : ""
      )
    };
    const jobConfig = {
      rules: [{ type: "string", required: true, message: "请输入岗位名称" }],
      initialValue: String(
        this.state.employeeDetail.deptList[0]
          ? this.state.employeeDetail.deptList[0].job
          : ""
      )
    };
    const roleNameConfig = {
      rules: [{ type: "string", required: true, message: "请选择角色" }],
      initialValue: String(
        this.state.employeeDetail.roleList[0]
          ? this.state.employeeDetail.roleList[0].roleId
          : ""
      )
    };
    const remarkConfig = {
      rules: [{ type: "string", required: false, message: "" }],
      initialValue: this.state.employeeDetail.EmployeeMessage.remark
    };
    return (
      <div className="main">
        <div className="header" style={{display:'none'}}>员工管理</div>
        <div className="add-role">
          <div className="title">
          <span className="bold">查看员工信息</span>
            <Button className="btn btn-line" onClick={() => window.history.back()}>返回</Button>
            <Button className="btn btn-line" type="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
            <Button className="btn" type="primary" onClick={this.deleteEmployee.bind(this)}>删除</Button>
          </div>
          <div className="role-form">
            <Form onSubmit={this.handleSubmit}>
              <div className="form-top">
                <div className="item">
                  <FormItem
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    label="手机号码"
                  >
                    <span>{this.state.employeeDetail.EmployeeMessage.mobile}</span>
                    {getFieldDecorator("mobile", mobileConfig)(
                      <Input
                        disabled
                        hidden
                        type="text"
                        placeholder="请输入手机号码"
                        style={{ width: "272px" }}
                      />
                    )}
                  </FormItem>
                </div>
                <div className="item">
                  <FormItem
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    label="创建时间"
                  >
                    <span>{this.state.employeeDetail.EmployeeMessage.addTime}</span>
                  </FormItem>
                </div>
                <div className="item">
                  <FormItem
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    label="姓名"
                  >
                    {getFieldDecorator("userName", userNameConfig)(
                      <Input
                        type="text"
                        placeholder="请输入姓名"
                        style={{ width: "272px" }}
                      />
                    )}
                  </FormItem>
                </div>
                <div className="item">
                  <FormItem
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    label="所属部门"
                  >
                    {getFieldDecorator("deptId", deptConfig)(
                      <Select
                        placeholder="请选择所属部门"
                        onChange={this.handleDeptChange}
                        style={{ width: "272px" }}
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
                    <span className="add-dept-link">新增部门</span>
                  </FormItem>
                </div>
                <div className="item">
                  <FormItem
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    label="岗位名称"
                  >
                    {getFieldDecorator("job", jobConfig)(
                      <Input
                        type="text"
                        placeholder="请输入岗位名称"
                        style={{ width: "272px" }}
                      />
                    )}
                  </FormItem>
                </div>
                <div className="item">
                  <FormItem
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    label="角色"
                  >
                    {getFieldDecorator("roleId", roleNameConfig)(
                      <Select
                        disabled={
                          this.state.employeeDetail.roleList[0] &&
                          this.state.employeeDetail.roleList[0].roleId === 0
                        }
                        placeholder="请选择角色"
                        onChange={this.handleRoleChange}
                        style={{ width: "272px" }}
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
                    <span className="add-role-link" onClick={this.toAddRole.bind(this)}>新增角色</span>
                  </FormItem>
                </div>
                <div className="item2">
                  <FormItem
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    label="备注"
                  >
                    {getFieldDecorator("remark", remarkConfig)(
                      <TextArea
                        rows={4}
                        placeholder="请输入备注"
                        style={{ width: "272px" }}
                      />
                    )}
                  </FormItem>
                </div>
              </div>
              <div className="form-bottom">
                
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const EditEmployee = Form.create()(EditEmployeeForm);

export default EditEmployee;
