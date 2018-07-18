import React, { Component } from "react";
import "./index.css";
import { Form, Input, Select, Button, message, Checkbox } from "antd";
import Api from "../../../request.js";
import { postPageHeight } from "../../../utils/index";

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class AddEmployeeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      mobile: "",
      userName: "",
      userId: "",
      dept: [], //全部部门列表
      roles: [] //全部角色列表
    };
  }
  setMobile(e) {
    this.setState({
      mobile: e.target.value,
      checked: false
    });
  }
  //校验手机号
  checkMobile(e) {
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    let mobile = this.state.mobile;
    if (reg.test(this.state.mobile)) {
      Api.post(`employee/getUserMessage/`, {
        mobile: this.state.mobile
      }).then(res => {
        if (res.data.status === 1) {
          message.success("校验成功");
          this.setState({
            checked: true,
            userName: res.data.body.name,
            userId: res.data.body.userId
          });
        } else {
          message.error(res.data.msg);
        }
      });
    } else if (!mobile) {
      message.warn("请输入手机号");
    } else {
      message.warn("手机号格式不正确");
    }
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
        roleId: Number(fieldsValue["roleId"]),
        remark: fieldsValue["remark"],
        deptList: [
          {
            ...this.state.dept.filter(
              item => item.deptId.toString() === fieldsValue["deptId"]
            )[0],
            job: fieldsValue["job"]
          }
        ],
        enterpriseId: 1001,
        userId: this.state.userId,
        bussType: 1,
        bussId: 2546
      };
      console.log(values);
      this.AddEmployee(values);
    });
  };
  AddEmployee(params) {
    // 添加员工
    Api.post(`employee/addOrEditEmployee/`, params).then(res => {
      if (res.data.status === 1) {
        message.success("添加成功");
        this.props.form.resetFields();
        this.setState({ roots: [] });
      } else {
        message.error(res.data.msg);
      }
    });
  }
  handleDeptChange(value, option) {}
  handleRoleChange(value) {}
  toAddRole() {
    this.props.history.push(`add-role`);
  }
  componentDidMount() {
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
    postPageHeight()
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const mobileConfig = {
      rules: [{ type: "string", required: true, message: "请输入手机号码" }]
    };
    const userNameConfig = {
      rules: [{ type: "string", required: false, message: "请输入姓名" }],
      initialValue: this.state.userName
    };
    const deptConfig = {
      rules: [{ type: "string", required: true, message: "请选择所属部门" }]
    };
    const jobConfig = {
      rules: [{ type: "string", required: true, message: "请输入岗位名称" }]
    };
    const roleNameConfig = {
      rules: [{ type: "string", required: true, message: "请选择角色" }]
    };
    return (
      <div className="main">
        <div className="header" style={{display:'none'}}>员工管理</div>
        <div className="add-role">
          <div className="title">
            <span className="bold">新增员工信息</span>
            <Button className="btn btn-line" onClick={() => window.history.back()}>返回</Button>
            <Button className="btn" type="primary" onClick={this.handleSubmit.bind(this)}>确定</Button>
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
                    {getFieldDecorator("mobile", mobileConfig)(
                      <Input
                        type="text"
                        placeholder="请输入手机号码"
                        style={{ width: "272px" }}
                        onChange={e => this.setMobile(e)}
                      />
                    )}
                    <Checkbox
                      className="check"
                      onChange={e => this.checkMobile(e)}
                      checked={this.state.checked}
                    >
                      {this.state.checked ? "校验成功" : "校验手机号"}
                    </Checkbox>
                  </FormItem>
                </div>
                <div className="item">
                  <FormItem
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    label="真实姓名"
                  >
                    {getFieldDecorator("userName", userNameConfig)(
                      <Input
                        disabled
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
                    {getFieldDecorator("remark")(
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

const AddEmployee = Form.create()(AddEmployeeForm);

export default AddEmployee;
