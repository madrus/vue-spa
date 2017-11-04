// jshint esversion:6,-W033
import Vue from 'vue'
import Post from '../../../src/theme/Post.vue'

describe('Post.vue', () => {
  it('should render the link', () => {
    const PostConstructor = Vue.extend(Post)
    const comp = new PostConstructor({
      propsData: {
        link: 'http://www.pluralsight.com'
      }
    }).$mount()
    // console.log(comp)
    expect(comp.$el.querySelector('.card-footer-item').getAttribute('href'))
      .to.equal('http://www.pluralsight.com')
  })
})
