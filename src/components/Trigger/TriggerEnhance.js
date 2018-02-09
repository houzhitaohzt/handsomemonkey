import getContainerRenderMixin from 'rc-util/lib/getContainerRenderMixin';

export const TriggerEnhance=ComposedComponent=>{
    Object.assign(ComposedComponent.prototype,getContainerRenderMixin({
      autoMount: false,

      isVisible(instance) {
        return instance.state.popupVisible;
      },

      getContainer(instance) {
        const popupContainer = document.createElement('div');
        const mountNode = instance.props.getPopupContainer ?
          instance.props.getPopupContainer(findDOMNode(instance)) : document.body;
        mountNode.appendChild(popupContainer);
        return popupContainer;
      },
    }))
}

export default TriggerEnhance;

