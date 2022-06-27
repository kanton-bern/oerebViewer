<template>
  <div v-show="visible" class="h-full relative">
    <div id="map" class="h-full" />
    <MapActions @layer-focus="focus" />
    <MapLayerManager
      @layer-added="addLayer"
      @layer-removed="removeLayer"
      @layer-focus="focus"
    />
    <MapPointerPreview
      @overlay-added="addOverlay"
      @overlay-removed="removeOverlay"
      @layer-added="addLayer"
      @layer-removed="removeLayer"
      @layer-focus="focus"
    />
    <MapPropertyLayers
      @layer-added="addLayer"
      @layer-removed="removeLayer"
      @layer-focus="focus"
    />
    <slot />
  </div>
</template>

<script>
import 'ol/ol.css'
import { register } from 'ol/proj/proj4'
import proj4 from 'proj4'
import { Map, View } from 'ol'
import { get as getProjection, transform } from 'ol/proj'
import { ScaleLine } from 'ol/control'
import { mapActions } from 'vuex'
import * as config from '~/config/setup'

export default {
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      map: null,
    }
  },

  watch: {
    '$store.state.map.zoom': {
      immediate: true,
      handler() {
        if (this.map) {
          const newValue = this.$store.state.map.zoom

          const view = this.map.getView()
          if (view.getZoom() !== newValue) {
            view.setZoom(newValue)
          }
        }
      },
    },

    '$store.state.map.jumpToSwissCoordinates': {
      immediate: true,
      handler() {
        const swissCoordinates = this.$store.state.map.jumpToSwissCoordinates

        if (this.map && swissCoordinates) {
          const view = this.map.getView()

          view.setCenter(swissCoordinates)
          this.setZoom(18)
        }
      },
    },

    visible(newValue, oldValue) {
      if (newValue && !oldValue) {
        this.render()
      }
    },
  },

  created() {
    this.registerSwissProjections()
  },

  mounted() {
    this.initMap()
  },

  methods: {
    ...mapActions('map', ['setZoom', 'previewCoordinate']),

    registerSwissProjections() {
      for (const key in config.projectionDefinitions) {
        if (Object.hasOwnProperty.call(config.projectionDefinitions, key)) {
          const definition = config.projectionDefinitions[key]

          proj4.defs(`EPSG:${definition.type}`, definition.proj4)
        }
      }

      register(proj4)
    },

    initMap() {
      const view = this.createView()
      const controls = this.createControls()

      this.map = new Map({
        target: 'map',
        controls,
        view,
      })

      this.registerForZoomChanged()
      this.map.on('singleclick', this.handleSingleClick)
    },

    registerForZoomChanged() {
      const view = this.map.getView()

      view.on('change:resolution', () => {
        const currentZoom = this.$store.state.map.zoom

        const newValue = this.map.getView().getZoom()
        if (currentZoom !== newValue) {
          this.setZoom(newValue)
        }
      })
    },

    createView() {
      const settings = {
        ...config.view,
      }

      settings.center = [settings.centerX, settings.centerY]
      delete settings.centerX
      delete settings.centerY

      settings.projection = getProjection(settings.projection)

      return new View(settings)
    },

    createControls() {
      return [
        new ScaleLine({
          units: 'metric',
        }),
      ]
    },

    addLayer(layer) {
      this.map.addLayer(layer)
    },

    removeLayer(layer) {
      this.map.removeLayer(layer)
    },

    addOverlay(overlay) {
      this.map.addOverlay(overlay)
    },

    removeOverlay(overlay) {
      this.map.removeOverlay(overlay)
    },

    async handleSingleClick(pointerEvent) {
      // handle click events only if oereb layer is visible
      if (
        !this.$store.state.map.zoom ||
        this.$store.state.map.zoom < config.zoom.oerebLayer
      )
        return

      const transformedXYCoordinate = transform(
        pointerEvent.coordinate,
        'EPSG:2056',
        'EPSG:4326'
      )

      const globalCoordinate = {
        latitude: transformedXYCoordinate[1],
        longitude: transformedXYCoordinate[0],
      }
      const swissCoordinate = {
        longitude: pointerEvent.coordinate[0],
        latitude: pointerEvent.coordinate[1],
      }

      await this.previewCoordinate({
        globalCoordinate,
        swissCoordinate,
      })
    },

    focus({ target }) {
      if (!target) return

      this.map.getView().fit(target, { padding: [100, 100, 50, 50] })
    },

    render() {
      this.$nextTick(() => {
        if (this.map) {
          this.map.updateSize()
        }
      })
    },
  },
}
</script>
