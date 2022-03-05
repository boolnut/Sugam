<%- include('header'); -%>

<div class="h-screen flex flex-row flex-wrap">


	<div class="card">

		<div class="card-body">
			<h2 class="font-bold text-lg mb-10">Scan Results</h2>

			<!-- start a table -->
			<table class="table-fixed w-full">

				<!-- table head -->
				<thead class="text-left">
					<tr>
						<th class="w-1/4 pb-10 text-sm font-extrabold tracking-wide">Scan ID</th>
						<th class="w-1/4 pb-10 text-sm font-extrabold tracking-wide text-right">Website Name</th>
						<th class="w-1/2 pb-10 text-sm font-extrabold tracking-wide text-center">URL</th>
						<th class="w-1/4 pb-10 text-sm font-extrabold tracking-wide text-right">Scan Date & Time</th>
						<th class="w-1/4 pb-10 text-sm font-extrabold tracking-wide text-right">Scan Level</th>
						<th class="w-1/4 pb-10 text-sm font-extrabold tracking-wide text-right">Image</th>
						<th class="w-1/4 pb-10 text-sm font-extrabold tracking-wide text-right">Video</th>
						<th class="w-1/4 pb-10 text-sm font-extrabold tracking-wide text-right">Document</th>
						<th class="w-1/4 pb-10 text-sm font-extrabold tracking-wide text-right">Result</th>
						<th class="w-1/4 pb-10 text-sm font-extrabold tracking-wide text-right">Processing Frequency
						</th>
						
					</tr>
				</thead>
				<!-- end table head -->

				<!-- table body -->
				<tbody class="text-left text-gray-600">

					<!-- item -->
					<tr>
						<!-- name -->
						<th class="w-1/4 mb-4 text-xs font-extrabold tracking-wider flex flex-row items-center w-full">						
							<p class="ml-3 name-1"><%= data[0][0]['scan_id'] %></p>
						</th>
						<!-- name -->

						<!-- product -->
						<th class="w-1/4 mb-4 text-xs font-extrabold tracking-wider text-right"><p class="ml-3 name-1">
							<%= data[0][0]['websitename'] %>
						</p></th>
						<!-- product -->

						<!-- invoice -->
						<th class="w-1/4 mb-4 text-xs font-extrabold tracking-wider text-right"><p class="ml-3 name-1">
							<%= new URL(data[0][0]['url']).hostname.toLowerCase() %>
						</p>
						</th>
						<!-- invoice -->

						<!-- price -->
						<th class="w-1/4 mb-4 text-xs font-extrabold tracking-wider text-right"><p class="ml-3 name-1">
							<%= new Date(data[0][0]['date']).getDate()%>/<%= new Date(data[0][0]['date']).getMonth()+1%>/<%= new Date(data[0][0]['date']).getFullYear()%>
										<%= new Date(data[0][0]['date']).getHours()%>:<%= new Date(data[0][0]['date']).getMinutes()%>:<%= new
													Date(data[0][0]['date']).getSeconds()%>
						</p>
						</th>
						<!-- price -->

						<!-- status -->
						<th class="w-1/4 mb-4 text-xs font-extrabold tracking-wider text-right"><p class="ml-3 name-1">
							<%= data[0][0]['level'] %>
						</p></th>
						<th class="w-1/4 mb-4 text-xs font-extrabold tracking-wider text-right">
							<p class="ml-3 name-1">
								<%= data[0][0]['imgcount'] %>
							</p>
						</th>
						<th class="w-1/4 mb-4 text-xs font-extrabold tracking-wider text-right">
							<p class="ml-3 name-1">
								<%= data[0][0]['vdcount'] %>
							</p>
						</th>
						<th class="w-1/4 mb-4 text-xs font-extrabold tracking-wider text-right">
							<p class="ml-3 name-1">
								<%= data[0][0]['document'] %>
							</p>
						</th>
						<!-- status -->
						<!-- status -->
						<th class="w-1/4 mb-4 text-xs font-extrabold tracking-wider text-right">
							<p class="ml-3 name-1">
								<%= data[0][0]['result'] %>
							</p>
						</th>
						<!-- status -->
						<!-- status -->
						<th class="w-1/4 mb-4 text-xs font-extrabold tracking-wider text-right">
							<p class="ml-3 name-1">
								<%= data[0][0]['frequency'] %>
							</p>
						</th>
						<!-- status -->

					</tr>
					<!-- item -->

				</tbody>
				<!-- end table body -->

			</table>
			<!-- end a table -->
		</div>


		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<link rel="stylesheet" type="text/css" href="./stylesheets/pagination.css">
		

		<div class="dropdownurl" style="float: left;width: 25%;">
			<span>Check child URL</span>
			<div class="dropdownurl-content">
			<% if(data[0].length > 1){   %>
			
				<% for(var j=0; j<data[0].length; j++) {  %>
				<p style="margin-top: 3%;"> <a class="mr-2 transition duration-500 ease-in-out hover:text-gray-900" href="./childURLDetails?scan_id=<%= data[0][j].scan_id %>&web_id=<%= data[0][j].web_id %>"
						><%= data[0][j].webname %></a></p>
			   <%}
			}else{%>
			    <p style="margin-top: 3%;"><span>No Record Found</span></p>			    
			<% } %>
						
			</div>
		</div>


		
			
		<div class="container" role="main"  style="width: 63%; margin-left: 29%; ">
			
			<% for(var i=0; i<data[1].length; i++) {%>
				<% if(data[1][i].typeCode === 1) {%>
			    
			    <div class="card content" style="border-width: 10px !important;"> 
				    <div class="card-header btn-bs-danger" style="height: 0px;"><%= data[1][i].code %></div>
			       	<div class="card-body">
					    <strong class="card-text">error:</strong> <%= data[1][i].message %>
					    <br><br>
					    <a class="btn btn-danger"> <p> <code> <%= data[1][i].context %> </code></p> </a>
				    </div>
			    </div>
			<% } else if (data[1][i].typeCode === 2) {%>
			
			
			<div class="card content">
				<div class="card-header btn-bs-info" style="height: 0px;"><%= data[1][i].code %></div>
				<div class="card-body">
					<strong class="card-text">warning:</strong> <%= data[1][i].message %>
					<br><br>
					<a class="btn btn-info"> <p><code><%= data[1][i].context %></code></p></a>
				</div>
			</div>
			<% } else if (data[1][i].typeCode===3) {%>
			<div class="card content">
				<div class="card-header btn-bs-secondary" style="height: 0px;"><%= data[1][i].code %></div>
				<div class="card-body">
					<strong class="card-text">Notices:</strong> <%= data[1][i].message %>
					<br><br>
					<a class="btn btn-gray"><p><code><%= data[1][i].context %></code></p></a>
				</div>
			</div>
			
			<% }
		} %>
		</div>

	



		<script>

					function getPageList(totalPages, page, maxLength) {
						if (maxLength < 5) throw "maxLength must be at least 5";

						function range(start, end) {
							return Array.from(Array(end - start + 1), (_, i) => i + start);
						}

						var sideWidth = maxLength < 9 ? 1 : 2;
						var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
						var rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;
						if (totalPages <= maxLength) {
							// no breaks in list
							return range(1, totalPages);
						}
						if (page <= maxLength - sideWidth - 1 - rightWidth) {
							// no break on left of page
							return range(1, maxLength - sideWidth - 1)
								.concat(0, range(totalPages - sideWidth + 1, totalPages));
						}
						if (page >= totalPages - sideWidth - 1 - rightWidth) {
							// no break on right of page
							return range(1, sideWidth)
								.concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
						}
						// Breaks on both sides
						return range(1, sideWidth)
							.concat(0, range(page - leftWidth, page + rightWidth),
								0, range(totalPages - sideWidth + 1, totalPages));
					}

					// Below is an example use of the above function.
					$(function () {
						// Number of items and limits the number of items per page
						var numberOfItems = $("#jar .content").length;
						var limitPerPage = 5;
						// Total pages rounded upwards
						var totalPages = Math.ceil(numberOfItems / limitPerPage);
						// Number of buttons at the top, not counting prev/next,
						// but including the dotted buttons.
						// Must be at least 5:
						var paginationSize = 7;
						var currentPage;

						function showPage(whichPage) {
							if (whichPage < 1 || whichPage > totalPages) return false;
							currentPage = whichPage;
							$("#jar .content").hide()
								.slice((currentPage - 1) * limitPerPage,
									currentPage * limitPerPage).show();
							// Replace the navigation items (not prev/next):            
							$(".pagination li").slice(1, -1).remove();
							getPageList(totalPages, currentPage, paginationSize).forEach(item => {
								$("<li>").addClass("page-item")
									.addClass(item ? "current-page" : "disabled")
									.toggleClass("active", item === currentPage).append(
										$("<a>").addClass("page-link").attr({
											href: "javascript:void(0)"
										}).text(item || "...")
									).insertBefore("#next-page");
							});
							// Disable prev/next when at first/last page:
							$("#previous-page").toggleClass("disabled", currentPage === 1);
							$("#next-page").toggleClass("disabled", currentPage === totalPages);
							return true;
						}

						// Include the prev/next buttons:
						$(".pagination").append(
							$("<li>").addClass("page-item").attr({ id: "previous-page" }).append(
								$("<a>").addClass("page-link").attr({
									href: "javascript:void(0)"
								}).text("Prev")
							),
							$("<li>").addClass("page-item").attr({ id: "next-page" }).append(
								$("<a>").addClass("page-link").attr({
									href: "javascript:void(0)"
								}).text("Next")
							)
						);
						// Show the page links
						$("#jar").show();
						showPage(1);

						// Use event delegation, as these items are recreated later    
						$(document).on("click", ".pagination li.current-page:not(.active)", function () {
							return showPage(+$(this).text());
						});
						$("#next-page").on("click", function () {
							return showPage(currentPage + 1);
						});

						$("#previous-page").on("click", function () {
							return showPage(currentPage - 1);
						});
					});

		</script>

	 </div>
	

</div>

