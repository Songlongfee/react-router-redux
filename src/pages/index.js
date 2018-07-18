import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import RoleManage from "./RoleManage/roleList/index";
import AddRole from "./RoleManage/AddRole/index";
import EditRole from "./RoleManage/EditRole/index";
import EmployeeList from "./employeeManage/list/index";
import AddEmployee from "./employeeManage/add/index";
import EditEmployee from "./employeeManage/edit/index";

class App extends Component {
  render() {
    return(
      <HashRouter>
        <Switch>
          <Route path="/role-list" component={RoleManage} />
          <Route path="/add-role" component={AddRole} />
          <Route path="/edit-role" component={EditRole} />
          <Route path="/employee-list" component={EmployeeList} />
          <Route path="/add-employee" component={AddEmployee} />
          <Route path="/edit-employee" component={EditEmployee} />
          <Route path="/" component={RoleManage} />
        </Switch>
      </HashRouter>
    )
  }
}

export default App;