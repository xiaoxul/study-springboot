<%@ page language="java" contentType="text/html; charset=UTF-8"
 pageEncoding="UTF-8" isELIgnored="false"%>
 <%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
 
<div style="margin:0px auto; width:500px">

<form:form action="updatesave" method="post" modelAttribute = "studentEntity">
<table>
        <tr>
            <td>NAME：</td>
            <td><input name="name" value="${studentEntity.name}" ></td>
        </tr>
        <tr>
            <td>AGE：</td>
            <td><input name="age" value="${studentEntity.age}" ></td>
        </tr>
        <tr>
            <td>SEX：</td>
            <td><input name="sex" value="${studentEntity.sex}" ></td>
        </tr>
        <tr>
            <td>
               <button type="submit" style= "color:#000000;background-color:#F08080">SUBMIT</button>
            </td>
        </tr>
    </table>
</form:form>
</div>