import React, { Component } from "react";
import "./index.css";
import { Form, Input, Tree, Button, message } from "antd";
import Api from "../../../request.js";
import { postPageHeight } from "../../../utils/index";

const FormItem = Form.Item;
const { TextArea } = Input;
const TreeNode = Tree.TreeNode;

class EditRoleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleName: "",
      note: "",
      tree: [],
      roots: [], //已选子权限
      parentRoots: [],
      expandedKeys: []
    };
    this.treeNodeCheck = this.treeNodeCheck.bind(this);
  }
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };
  treeNodeCheck(roots, info) {
    // 选择权限节点
    console.log(roots, info);
    let showErr;
    if (roots.length > 0) {
      showErr = false;
    }
    this.setState({
      roots,
      parentRoots: [...roots, ...info.halfCheckedKeys], //包含半选状态的父节点
      showErr
    });
    console.log(roots, [...roots, ...info.halfCheckedKeys]);
  }
  handleSubmit = e => {
    // 提交表单
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (this.state.roots.length === 0) {
        this.setState({
          showErr: true,
          errMsg: "请选择权限"
        });
        return;
      }
      console.log(this.state.parentRoots);
      const values = {
        ...fieldsValue,
        userId: 10000000,
        roleId: this.state.roleId,
        relationId: 121,
        moduleType: 1, //业务类型
        roleName: fieldsValue["roleName"],
        note: fieldsValue["note"] || "",
        rootList: this.state.parentRoots.map(item => Number(item))
      };
      this.editRole({
        ...values
      });
    });
  };
  editRole(params) {
    // 编辑角色保存
    Api.post(`role/saveOrUpdateRole`, params).then(res => {
      if (res.data.status === 0) {
        message.success("保存成功");
      } else {
        message.error(res.data.msg);
      }
    });
  }

  componentDidMount() {
    const roleId = this.props.location.search.substr(1);
    this.setState({ roleId });
    //将后台返回半选父节点删除
    let rootArr = [];
    let findRoot = arr => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].childList) {
          findRoot(arr[i].childList);
        } else {
          rootArr.push(arr[i].functionId.toString());
        }
      }
      return rootArr;
    };
    Api.post(`function/getAllFunctionList`, {
      //bussId: 456789, //钱包id
      bussType: 1 //后台类型
    }).then(res => {
      // 获取权限树
      if (res.data.status === 0) {
        this.setState({
          tree: res.data.body.function
        });
        Api.post(`role/getRoleDetail`, {
          roleId: roleId,
          userId: 124,
          relationId: 4534 //测试数据
        }).then(res => {
          // 获取角色详情
          if (res.data.status === 0) {
            this.setState({
              roleName: res.data.body.role.roleName,
              note: res.data.body.role.remark,
              roots: findRoot(res.data.body.functionList)
              // ["10"] ||
              // findRoot(res.data.body.functionList.map(item =>
              //   item.functionId.toString()
              // )
            });
            postPageHeight()
          } else {
            message.error(res.data.msg);
            postPageHeight()
          }
        });
      } else {
        message.error(res.data.msg);
        postPageHeight()
      }
    });
  }
  //生成权限树
  createNodeTree(tree) {
    let recursion = tree =>
      tree.map(item => (
        <TreeNode title={item.functionName} key={item.functionId}>
          {item.childList && item.childList.length && recursion(item.childList)}
        </TreeNode>
      ));
    return (
      <FormItem className="tree-wrap">
        <Tree
          checkable
          onExpand={this.onExpand}
          expandedKeys={this.state.expandedKeys}
          checkedKeys={this.state.roots}
          onCheck={this.treeNodeCheck}
        >
          {recursion(this.state.tree)}
        </Tree>
      </FormItem>
    );
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const roleNameConfig = {
      rules: [{ type: "string", required: true, message: "请输入角色名称" }],
      initialValue: this.state.roleName
    };
    const noteConfig = {
      rules: [{ type: "string", required: false, message: "请输入备注" }],
      initialValue: this.state.note
    };
    return (
      <div className="main">
        <div className="header bold">角色管理</div>
        <div className="add-role">
          <div className="title bold">修改角色信息</div>
          <div className="role-form">
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <div className="form-top">
                <div className="form-left">
                  <div className="item">
                    <FormItem label="角色名称">
                      {getFieldDecorator("roleName", roleNameConfig)(
                        <Input
                          type="text"
                          placeholder="请输入角色名称"
                          style={{ width: "272px" }}
                        />
                      )}
                    </FormItem>
                  </div>
                  <div className="item2">
                    <FormItem label="备注">
                      {getFieldDecorator("note", noteConfig)(
                        <TextArea
                          rows={4}
                          placeholder="请输入备注"
                          onChange={this.handleNoteChange}
                          style={{ width: "272px" }}
                        />
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className="form-right">
                  {this.createNodeTree(this.state.tree)}
                  <div className="err-msg">
                    {this.state.showErr ? this.state.errMsg : ""}
                  </div>
                </div>
              </div>
              <div className="form-bottom">
                <FormItem>
                  <Button className="btn" onClick={() => window.history.back()}>
                    返回
                  </Button>
                  <Button type="primary" htmlType="submit">
                    确定
                  </Button>
                </FormItem>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const EditRole = Form.create()(EditRoleForm);

export default EditRole;
