window.applicationCache.addEventListener('updateready', function (e) {
  if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
    // Browser downloaded a new app cache.
    // Swap it in and reload the page to get the new hotness.
    try {
      window.applicationCache.swapCache()
    } catch (e) {
      //
    }

    if (global.confirm('A new version of this site is available. Do you want to refresh?')) {
      window.location.reload()
    }
  }
}, false)

window.applicationCache.addEventListener('error', function (e) {
  setTimeout(function () {
    try {
      window.applicationCache.update()
    } catch (e) {
      console.error('No application cache found. (3)')
    }
  }, 5000)
}, false)
