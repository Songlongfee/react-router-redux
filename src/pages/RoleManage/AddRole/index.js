import React, { Component } from "react";
import "./index.css";
import { Form, Input, Tree, Button, message } from "antd";
import Api from "../../../request.js";
import { postPageHeight } from "../../../utils/index";
import * as actions from "../../../actions/roleListAction";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const FormItem = Form.Item;
const { TextArea } = Input;
const TreeNode = Tree.TreeNode;

class AddRoleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: [],
      roots: [], //已选权限
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
      const values = {
        ...fieldsValue,
        userId: 10000000,
        relationId: 121,
        moduleType: 1, //业务类型
        roleName: fieldsValue["roleName"],
        note: fieldsValue["roleNote"] || "",
        rootList: this.state.parentRoots.map(
          // roleId: 6,
          item => Number(item)
        )
      };
      console.log(values);
      this.addRole({
        ...values
      });
    });
  };
  addRole(params) {
    // 添加角色
    Api.post(`role/saveOrUpdateRole/`, params).then(res => {
      if (res.data.status === 0) {
        message.success("添加成功");
        this.props.form.resetFields();
        this.setState({ roots: [] });
      } else {
        message.error(res.data.msg);
      }
    });
  }
  componentDidMount() {
    console.log(this.props)
    Api.post(`function/getAllFunctionList`, {
      bussType: 1 //后台类型
    }).then(res => {
      //获取权限树
      if (res.data.status === 0) {
        this.setState({
          tree: res.data.body.function
        });
        postPageHeight()
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
    // const { relationId } = this.props;
    console.log(this.props)
    const { getFieldDecorator } = this.props.form;
    const roleNameConfig = {
      rules: [{ type: "string", required: true, message: "请输入角色名称" }]
    };
    const roleNoteConfig = {
      rules: [{ type: "string", required: false, message: "请输入备注" }]
    };
    return (
      <div className="main">
        <div className="header bold">角色管理</div>
        <div className="add-role">
          <div className="title bold">新增角色信息</div>
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
                      {getFieldDecorator("roleNote", roleNoteConfig)(
                        <TextArea
                          rows={4}
                          placeholder="请输入备注"
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

const AddRole = Form.create()(AddRoleForm);

function mapStateToProps(state) {
  console.log(state)
  let { roleListReducer } = state;
  return roleListReducer
}

function mapDispatchToProps(dispatch) {
  console.log(actions)
  return {
		actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddRole);

// export default AddRole;
