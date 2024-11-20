<template>
  <div>
    <MapActionButton @clicked="showMyLocationActionClicked">
      <MapActionButtonSvg>
        <path
          d="M16 1.333q2.99 0 5.703 1.161t4.677 3.125 3.125 4.677 1.161 5.703-1.161 5.703-3.125 4.677-4.677 3.125-5.703 1.161-5.703-1.161-4.677-3.125-3.125-4.677-1.161-5.703 1.161-5.703 3.125-4.677 4.677-3.125 5.703-1.161zM17.333 4.073v3.927q0 0.552-0.391 0.943t-0.943 0.391-0.943-0.391-0.391-0.943v-3.927q-2.063 0.229-3.911 1.135t-3.245 2.302-2.302 3.245-1.135 3.911h3.927q0.552 0 0.943 0.391t0.391 0.943-0.391 0.943-0.943 0.391h-3.927q0.229 2.063 1.135 3.911t2.302 3.245 3.245 2.302 3.911 1.135v-3.927q0-0.552 0.391-0.943t0.943-0.391 0.943 0.391 0.391 0.943v3.927q2.063-0.229 3.911-1.135t3.245-2.302 2.302-3.245 1.135-3.911h-3.927q-0.552 0-0.943-0.391t-0.391-0.943 0.391-0.943 0.943-0.391h3.927q-0.229-2.063-1.135-3.911t-2.302-3.245-3.245-2.302-3.911-1.135z"
        />
      </MapActionButtonSvg>
    </MapActionButton>
  </div>
</template>

<script setup>
import { useMapStore } from '~/store/map'
import { useNotificationStore } from '~/store/notification'
import { convertToSwissCoordinates } from '~/helpers/coordinates'

const { t } = useI18n()

const mapStore = useMapStore()
const notificationStore = useNotificationStore()

const showMyLocationActionClicked = () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: Infinity,
  }

  navigator.geolocation.getCurrentPosition(
    handlePositionGranted,
    handleError,
    options,
  )
}

const handlePositionGranted = async (pos) => {
  const swissCoordinates = convertToSwissCoordinates(
    pos.coords.longitude,
    pos.coords.latitude,
  )

  mapStore.jumpToSwissCoordinates(swissCoordinates)
  await mapStore.setPreviewCoordinate({
    globalCoordinate: {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    },
    swissCoordinate: {
      latitude: swissCoordinates[1],
      longitude: swissCoordinates[0],
    },
  })
}

const handleError = (err) => {
  console.warn(err)

  switch (err.code) {
    case err.PERMISSION_DENIED:
      notificationStore.notifyError(t('notification_geolocation_permission'))
      break
    case err.POSITION_UNAVAILABLE:
      notificationStore.notifyError(t('notification_geolocation_coordinates'))
      break
    default:
      notificationStore.notifyError(t('notification_geolocation_unknown'))
      break
  }
}
</script>
