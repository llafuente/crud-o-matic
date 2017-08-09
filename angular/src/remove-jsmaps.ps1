Foreach($jsMapFile in @(Get-ChildItem -Recurse -Filter *.js.map -Name)) {
  $jsFile = $jsMapFile -replace '.map$', ''

  echo "jsFile ${jsFile} jsMapFile ${jsMapFile}"

  Remove-Item ${jsFile}
  Remove-Item ${jsMapFile}
}
