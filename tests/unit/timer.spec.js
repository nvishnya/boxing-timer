import { shallowMount } from '@vue/test-utils'
import Timer from '@/components/Timer.vue'
import Vue from 'vue';
import Vuetify from 'vuetify';
Vue.use(Vuetify);

describe('Timer.vue', () => {
  describe('Methods', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallowMount(Timer)
      wrapper.vm.play = jest.fn();
    })
    it('starts when start() is called', () => {
      expect(wrapper.vm.isRunning).toBe(false)
      wrapper.vm.start()
      expect(wrapper.vm.isRunning).toBe(true)
      expect(wrapper.vm.interval).not.toBeNull()
      wrapper.vm.pause()
    })
    it('stops when pause() is called', () => {
      wrapper.vm.start()
      wrapper.vm.pause()
      expect(wrapper.vm.isRunning).toBe(false)
      expect(wrapper.vm.interval).toBeNull()
    })
    it('unpauses when start() is called', () => {
      wrapper.vm.start()
      wrapper.vm.pause()
      wrapper.vm.start()
      expect(wrapper.vm.isRunning).toBe(true)
      expect(wrapper.vm.interval).not.toBeNull()
      wrapper.vm.pause()
    })
    it('sets current to 1 when reset() is called', () =>{ 
      wrapper.vm.start()
      wrapper.vm.tick()
      expect(wrapper.vm.current).not.toBe(1)
      wrapper.vm.reset()
      expect(wrapper.vm.current).toBe(1)
    })
    it('stops and resets when time elapses', () => {
      wrapper.vm.start()
      wrapper.vm.current = wrapper.vm.total + 1
      wrapper.vm.tick()
      expect(wrapper.vm.isRunning).toBe(false)
      expect(wrapper.vm.interval).toBeNull()
    })
    it('returns current phase when getPhase() is called', () =>{
      wrapper.vm.prepare = 1
      wrapper.vm.round = 5
      wrapper.vm.rest = 3
      wrapper.vm.rounds = 2
      wrapper.vm.warning = 2

      wrapper.vm.start()
      expect(wrapper.vm.getPhase()).toEqual(['prepare', wrapper.vm.prepare])    
      wrapper.vm.tick()
      wrapper.vm.tick()
      wrapper.vm.tick()
      expect(wrapper.vm.getPhase()).toEqual(['round', 3])
      wrapper.vm.tick()      
      expect(wrapper.vm.getPhase()).toEqual(['warning', 2])
      wrapper.vm.tick()      
      wrapper.vm.tick()      
      expect(wrapper.vm.getPhase()).toEqual(['rest', 3])
      wrapper.vm.pause()
    })
    it('returns current round number when getPhaseNumber() is called', () => {
      wrapper.vm.prepare = 1
      wrapper.vm.round = 1
      wrapper.vm.rest = 1
      wrapper.vm.rounds = 2

      wrapper.vm.start()
      expect(wrapper.vm.getPhaseNumber()).toBe(1)
      wrapper.vm.tick()
      wrapper.vm.tick()
      wrapper.vm.tick()
      expect(wrapper.vm.getPhaseNumber()).toBe(2)
      wrapper.vm.pause()
    }),
    it('returns true if phase is in its first second', () => {
      wrapper.vm.warning = 5
      expect(wrapper.vm.isBegginingOfPhase('warning', 5)).toBe(true)
    })
  })
})


