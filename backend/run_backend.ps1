$mvnVersion = "3.9.6"
$mvnFolder = "apache-maven-$mvnVersion"
$mvnZip = "maven.zip"
$mvnUrl = "https://archive.apache.org/dist/maven/maven-3/$mvnVersion/binaries/apache-maven-$mvnVersion-bin.zip"

if (-not (Test-Path "$mvnFolder")) {
    Write-Host "Maven not found. Downloading Maven $mvnVersion..."
    Invoke-WebRequest -Uri $mvnUrl -OutFile $mvnZip
    Write-Host "Extracting Maven..."
    Expand-Archive -Path $mvnZip -DestinationPath .
    Remove-Item $mvnZip
}

Write-Host "Starting Java Backend using local Maven..."
$mvnExe = ".\$mvnFolder\bin\mvn.cmd"
& $mvnExe spring-boot:run
