<!DOCTYPE html>
<head>
	<link rel="stylesheet" href="lookGood.css">
</head>
<html>
	<body>
		
		<h1>High Score Page</h1>
		
		<form method="post" action="index.php">
			<label>Enter a Score</label>
			<input id="name" name="name"/>
			<input type="submit" value="submit" name="submit"/>
		</form>
		<?php
		
		if (!empty($_POST['submit']))
		{
			$servername = "sql300.epizy.com";
			$username = "epiz_24402955";
			$password = "xsWZEZCDDDvvGX";
			$dbname = "epiz_24402955_Names";

			// Create connection
			$conn = mysqli_connect($servername, $username, $password, $dbname);
			// Check connection
			if (!$conn) {
				die("Connection failed: " . mysqli_connect_error());
			}

			$sql = "INSERT INTO NameBox (id)
			VALUES ('" . $_POST['name'] . "')";

			if (mysqli_query($conn, $sql)) {
				echo "Score Saved" . "<br>";
			} else {
				echo "Error: " . $sql . "<br>" . mysqli_error($conn);
			}
			
			$sql = "SELECT id FROM NameBox ORDER BY id DESC LIMIT 10";
			
			$result = $conn->query($sql);

			echo "<div>";
			if ($result->num_rows > 0) {
				// output data of each row
				$i = 1;
				while($row = $result->fetch_assoc()) {
					echo "" . $i . ".\t" . $row["id"]. "<br>";
					$i++;
				}
			} else {
				echo "0 results";
			}
			echo "</div>";
			mysqli_close($conn);
			
		}
		?>

	</body>
</html>
