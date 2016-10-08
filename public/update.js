window.applicationCache.addEventListener('updateready', function (e) {
  if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
    // Browser downloaded a new app cache.
    // Swap it in and reload the page to get the new hotness.
    try {
      window.applicationCache.swapCache()
    } catch (e) {
      //
    }

    global.window.swal({
      title: 'New Living Documents version available',
      text: 'A new version of this site is available. Do you want to refresh?',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, refresh!',
      closeOnConfirm: true,
      html: false
    }, (isConfirm) => {
      if (isConfirm) {
        window.location.reload()
      }
    })
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
