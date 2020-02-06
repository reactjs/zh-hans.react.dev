import {createSubscription} from 'create-subscription';

const Subscription = createSubscription({
  getCurrentValue(sourceProp) {
    // 返回订阅的当前值（sourceProp）。
    return sourceProp.value;
  },

  subscribe(sourceProp, callback) {
    function handleSubscriptionChange() {
      callback(sourceProp.value);
    }

    // 订阅（例如：向订阅（sourceProp）添加事件监听器。
    // 每当订阅发生变化时，调用回调函数（新值）。
    sourceProp.subscribe(handleSubscriptionChange);

    // 返回取消订阅方法。
    return function unsubscribe() {
      sourceProp.unsubscribe(handleSubscriptionChange);
    };
  },
});

// 我们可以直接传递订阅的值，
// 而不是将可订阅的源传递给我们的 ExampleComponent：
<Subscription source={dataSource}>
  {value => <ExampleComponent subscribedValue={value} />}
</Subscription>;
