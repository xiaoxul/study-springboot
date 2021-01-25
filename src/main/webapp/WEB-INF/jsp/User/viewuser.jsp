<%@ page language="java" contentType="text/html; charset=UTF-8"
 pageEncoding="UTF-8" isELIgnored="false"%>
 
<div style="margin:0px auto; width:500px">
 
<form action="save" method="post"> 
    <table>        
        <tr>
            <td>W3ID</td>
            <td><input name="userid"></td>
        </tr>
        
         <tr>
            <td>Role(CATEGORY)</td>
            <td><input name="role_category"></td>
        </tr>
        <tr>
            <td>RoleID</td>
            <td><input name="role_key"></td>
        </tr>
   
        
        <tr>
            <td>UserName</td>
            <td><input name="username"></td>
        </tr>
        
          <tr>
            <td>LINEFLG</td>
            <td><input name=lineflg></td>
        </tr>
        
		 <tr>
            <td>COMMENT</td>
            <td><input name="comment"></td>
        </tr>
		 <tr>
            <td>CREATE_TIMESTAMP</td>
            <td><input name="create_timestamp"></td>
        </tr>
		<tr>
            <td>UPDATE_TIMESTAMP</td>
            <td><input name="update_timestamp"></td>
        </tr>
		<tr>
            <td>CREATE_USER</td>
            <td><input name="create_user"></td>
        </tr>
        <tr>
            <td>UPDATE_USER</td>
            <td><input name="update_user"></td>
        </tr>
        <tr>
            <td>
              <button type="submit" style= "color:#000000;background-color:#F08080">SUBMIT</button>
            </td>
        </tr>
    </table>
</form>
</div>