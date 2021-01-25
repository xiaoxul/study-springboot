<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ include file="w3ds_header.jsp" %>

<link rel="stylesheet" href="<%=request.getContextPath()%>/DataTables/datatables.css" rel="text/css" />
<script>
// Columns are ordered using 0 as first column on left. In a five column table the columns are numbered for sorting purposes like this: 0,1,2,3,4,5,6.
// Lets say you want to sort the fourth column (3) descending and the first column (0) ascending: your order: would look like this: order: [[ 3, 'desc' ], [ 0, 'asc' ]]
$(document).ready(function() {
    $('#userlisttable').DataTable( {
    	 "paging": true,	
         "lengthChange": true,
         "searching": true,
         "ordering": true,
         "aaSorting" : [[0, "asc"]],
         "info": true,
         "autoWidth": false
    } );
} );
</script>

 <!-- Right Main Content Start-->
<div class="ds-col-12 ds-padding-top-1">
 <div class ="ds-row">
  	<div class="ds-col-sm-12 ds-col-md-6 ds-col-lg-6 ds-col-xl-6  ds-align-text-left">
		<h2>ユーザー・リスト管理</h2>
	</div>
	
 </div>
	<div class="ds-table-container">
	    <table id="userlisttable" class="display ds-table" style="width:100%">
	        <thead>
	            <tr>
	                <th class="sorting" style="width:25%">W3ID</th>
	                <th class="sorting" style="width:25%">名前</th>
	                <th class="sorting" style="width:25%">ROLE</th>
	                <th class="sorting" style="width:25%">LINE</th>
	                <th class="sorting" style="width:25%">作成日</th>
	                <th class="sorting" style="width:25%">備考</th>
	            </tr>
	        </thead>
	        <tbody>
		    	<c:forEach var="userVo" items="${requestScope.userListVo.userVoList}">
					<tr>
						<td><a href='./detail?intranet_id=${userVo.userid}'><c:out value="${userVo.userid}" /></a></td>
						<td><c:out value="${userVo.username}" /></td>
						<td><c:out value="${userVo.role_category}" /></td>
						<td><c:out value="${userVo.lineflg}" /></td>
						
						<td><c:out value="${userVo.create_timestamp}" /></td>
						<td><c:out value="${userVo.comment}" /></td>
					</tr>
				</c:forEach>
	        </tbody>
	    </table>
	</div>
</div>
<!-- Right Main Content End-->
<%@ include file="w3ds_footer.jsp" %>