<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html style="height: 100%;">
<!-- include Part Start-->
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="Content-Language" content="EN" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>OIOBAMA</title>
    <link rel="stylesheet" href="<%=request.getContextPath()%>/w3ds/w3ds-3.8.0.css" type="text/css">
    <link rel="stylesheet" href="<%=request.getContextPath()%>/w3ds/customize-mobile.css" type="text/css">

    <!-- if data tables are required -->
    <link rel="stylesheet" href="<%=request.getContextPath()%>/w3ds/w3ds-data-tables.css" type="text/css">

    <!-- if code syntax highlighting is required -->
    <link rel="stylesheet" href="<%=request.getContextPath()%>/w3ds/w3ds-prism.css" rel="text/css" />
    <link rel="stylesheet" href="<%=request.getContextPath()%>/w3ds/w3ds-border-sides.css" rel="text/css" />

    <link rel="stylesheet" href="<%=request.getContextPath()%>/w3ds/lib/main.css" rel="text/css" />
    <link rel="stylesheet" href="<%=request.getContextPath()%>/w3ds/lib/select2.min.css" rel="text/css" />
    <link rel="stylesheet" href="<%=request.getContextPath()%>/w3ds/lib/tags-input.css" rel="text/css" />

<%--     <script type="text/javascript" src="<%=request.getContextPath()%>/js/daycount.js"></script> --%>
<script src="<%=request.getContextPath()%>/w3ds/lib/jquery.min.js"></script>

  </head>
  <body class="ds-has-sticky-footer">
            <a href="https://w3.ibm.com/"
            id="ds-w3-injectable-nav"
            data-layout="1"
            data-height="79"
            data-breakpoint="sm"
            target="_blank">w3</a>
  <!-- Hero Start-->
	<div class="ds-grid">
	  <div class="ds-row ds-bg-dark ds-padding-top-1" style="background-image: url(<%=request.getContextPath()%>/images/headspace_blue.jpg);background-position:center;background-size:cover;background-repeat:no-repeat;">
	    <div class="ds-col-xs-10 ds-offset-xs-1 ds-col-lg-8 ds-offset-lg-2 ds-col-xl-6 ds-offset-xl-3 ds-align-text-center ds-shadow-text">
	        <h1 class="hero__title">
	           OIOBAMA 
	        </h1>
	        <h2 class="hero__subtitle"> 
	            OIOBAMA Solutions japan
	        </h2>
	        <p class="ds-margin-bottom-3">
	        </p>
	  	</div>
		</div>
	</div>
  <!-- Hero End-->

  <!-- Nav (Mobile) Start-->
  <div class="ds-grid ds-hide-lg ds-hide-md ds-affix ds-full-width ds-bg-neutral-1 ds-border-bottom-neutral-3" id="top-of-page" style="z-index:100;">
    <!-- Overlay -->
    <div class="ds-overlay-fullscreen" id="nav-overlay" aria-hidden="true" hidden="true">
      <div class="ds-overlay-box" role="document">
        <button type="button" class="ds-close ds-button ds-flat ds-close-button-right ds-close-button" aria-label="close" tabindex="0">
          <span class="ds-icon-close"></span>
        </button>
        <div class="ds-overlay-content">
          <div class="ds-col-xs-8 ds-offset-xs-2 ds-align-text-center">
            <a class="ds-link-unstyled ds-padding-1 ds-display-inline-block" href="#">
              <h4 class="ds-heading-3 ds-margin-bottom-0">
                OiOBAMA
              </h4>
            </a>
          </div>
          <ul class="ds-accordion-large ds-margin-bottom-2">
            <li>
              <!-- Accordion Content 6 -->
              <div class="ds-accordion-control" id="accordion-control-nav-vocs" tabindex="0">
                <div class="ds-accordion-title ds-label ds-margin-bottom-0 ds-col-xs-10 ds-offset-xs-1 ds-col-sm-10 ds-offset-sm-1 ds-col-md-6 ds-offset-md-3">
               	  お客さん情報
                </div>
                <div class="ds-accordion-slidedown">
                  <div class="ds-col-xs-12 ds-col-sm-10 ds-offset-sm-1 ds-col-md-6 ds-offset-md-3">
                    <ul class="ds-list-unstyled ds-margin-bottom-0 ds-padding-bottom-0 ds-padding-left-sm-1">
                      <li><a class="ds-text-neutral-6" href="<%=request.getContextPath()%>/mainlog/add" tabindex="-1">提案中</a></li>
                      <li><a class="ds-text-neutral-6" href="<%=request.getContextPath()%>/mainlog/list" tabindex="-1">作成中</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="ds-accordion-control" id="accordion-control-nav-vocs" tabindex="0">
                <div class="ds-accordion-title ds-label ds-margin-bottom-0 ds-col-xs-10 ds-offset-xs-1 ds-col-sm-10 ds-offset-sm-1 ds-col-md-6 ds-offset-md-3">
               	  管理者用
                </div>
                <div class="ds-accordion-slidedown">
                  <div class="ds-col-xs-12 ds-col-sm-10 ds-offset-sm-1 ds-col-md-6 ds-offset-md-3">
                    <ul class="ds-list-unstyled ds-margin-bottom-0 ds-padding-bottom-0 ds-padding-left-sm-1">
                      <li><a class="ds-text-neutral-6" href="<%=request.getContextPath()%>/user/listUser" tabindex="-1">ユーザー作成</a></li>
                      <li><a class="ds-text-neutral-6" href="<%=request.getContextPath()%>/Control/listControl" tabindex="-1">コントロール一覧</a></li>
                      <li><a class="ds-text-neutral-6" href="<%=request.getContextPath()%>/Control/listControl" tabindex="-1">mail情報一覧</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="ds-col-xs-10 ds-offset-xs-1 ds-col-sm-10 ds-offset-sm-1 ds-col-md-6 ds-offset-md-3 ds-margin-top-1 ds-margin-bottom-1">
                <a class="ds-text-neutral-6 ds-label ds-padding-left-2_5" href="<%=request.getContextPath()%>/index" tabindex="-1">お知らせ</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <!-- Nav (Mobile) End-->



<!-- Main Content Start-->
<div class="ds-grid">
<div id="app">

<!-- Left Part Start-->
<div class="ds-col-xs-12 ds-col-sm-12 ds-col-md-2 ds-col-lg-2 ds-col-xl-3 ds-align-text-left">
<!-- include Side Nav Start-->
<!-- Side Nav Start-->
<div class="ds-input-container ds-margin-bottom-2 desktop-nav">
<div class="ds-row ds-margin-bottom-2" role="navigation" aria-label="left align">
    <div class="ds-side-nav ds-no-gutter ds-margin-top-2 ds-margin-bottom-2 ds-padding-top-0_5 ds-padding-bottom-0_5" style="position:relative;">
        <div class="ds-nav-item">
            <a href="">OIOBAMA</a>
        </div>
        <div class="ds-nav-section ds-expanded">
            <div class="ds-nav-sub-item">
                <a href="">お客さん情報</a>
            </div>
            <div class="ds-nav-section ds-expanded">
              <div <%if("/sales/jsp/user_list.jsp".equals(request.getServletPath())) out.print("class=\"ds-nav-sub-item ds-active\""); else out.print("class=\"ds-nav-sub-item\"");%>>
                    <a href="<%=request.getContextPath()%>/Cust/tCustInfo_list">提案中</a>
                </div>
                <div  <%if("/sales/jsp/user_add.jsp".equals(request.getServletPath())) out.print("class=\"ds-nav-sub-item ds-active\""); else out.print("class=\"ds-nav-sub-item\"");%>>
                    <a href="<%=request.getContextPath()%>/Cust/tCust_add">作成中</a>
                </div>
                 <div  <%if("/sales/jsp/user_add.jsp".equals(request.getServletPath())) out.print("class=\"ds-nav-sub-item ds-active\""); else out.print("class=\"ds-nav-sub-item\"");%>>
                    <a href="<%=request.getContextPath()%>/Cust/add">ALL</a>
                </div>
            </div>
        </div>
        <div class="ds-nav-section ds-expanded">
            <div class="ds-nav-sub-item">
                <a href="">管理者用</a>
            </div>
            <div class="ds-nav-section ds-expanded">
              <div <%if("/sales/jsp/user_list.jsp".equals(request.getServletPath())) out.print("class=\"ds-nav-sub-item ds-active\""); else out.print("class=\"ds-nav-sub-item\"");%>>
                    <a href="<%=request.getContextPath()%>/user/listUser">ユーザー一覧</a>
                </div>
                <div  <%if("/sales/jsp/user_add.jsp".equals(request.getServletPath())) out.print("class=\"ds-nav-sub-item ds-active\""); else out.print("class=\"ds-nav-sub-item\"");%>>
                    <a href="<%=request.getContextPath()%>/Control/listControl">コントロール情報一覧</a>
                </div>
   
                
              <div <%if("/sales/jsp/user_list.jsp".equals(request.getServletPath())) out.print("class=\"ds-nav-sub-item ds-active\""); else out.print("class=\"ds-nav-sub-item\"");%>>
                    <a href="<%=request.getContextPath()%>/Mail/listMail">mail一覧</a>
                </div>
                
               <div <%if("/sales/jsp/user_list.jsp".equals(request.getServletPath())) out.print("class=\"ds-nav-sub-item ds-active\""); else out.print("class=\"ds-nav-sub-item\"");%>>
                    <a href="<%=request.getContextPath()%>/Mail/listMail">mail一覧</a>
               </div>
               
                   

            <div class="ds-nav-sub-item">
                <a href="<%=request.getContextPath()%>/index">お知らせ</a>
            </div>
        </div>
    </div>
</div>

</div>
<!-- Side Nav End-->
<!-- include Side Nav End-->
</div>
</div>
<!-- Left Part End-->
<!-- Right Part Start-->
 <div class="ds-col-xs-12 ds-col-sm-12 ds-col-md-9 ds-col-lg-9 ds-col-xl-8  ds-align-text-left ds-padding-bottom-2">


<!-- <div class="ds-row ds-margin-bottom-1"> -->
 <!-- Mobile Nav Button Start-->
<div class="ds-input-container mobile-nav">
<div class="ds-row">
<div class="mobile-nav-chooser">

                Choose a page...
                <button class="ds-icon-size-medium ds-float-right ds-icon-dashboard ds-icon-button-dark" aria-label="mobile-nav" id="nav-overlay-open"></button>
</div>

 <hr class="ds-margin-top-2">
</div>
</div>
 <!-- Mobile Nav Button End-->
<!-- include Part End-->