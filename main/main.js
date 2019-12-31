var eventBus = new Vue();

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
  <div class="product">
  <div class="product-image">
    <img v-bind:src="image" alt="Socks-Image" />
  </div>

  <div class="product-info">
    <h1>{{title }}</h1>
    <span>{{ description }}</span>
    <p v-if="inStock" style="color: green;">In Stock</p>
    
    <p v-else style="color: red;" class="outOfStock">
      Out of Stock :(
    </p>
    <info-tabs :shipping="shipping" :details="details"></info-tabs>
    <p v-if="isOnSale" style="color: blueviolet;">{{sale}}</p>
    <p>shipping: {{shipping}}</p>
    <p>Available sizes:</p>
    <ul>
      <li v-for="size in sizes" :key="size">{{size}}</li>
    </ul>
    <div v-for="(variant, index) in variants"
      :key="variant.variantId" class="color-box"
      :style="{backgroundColor:variant.variantColor}"
      @mouseover="uodateProduct(index)"></div>
    <!-- <a v-bind:href="url">More Products</a> -->
    <button @click="addToCart" :disabled="!inStock"
      :class="{disabledButton:!inStock }">
      Add to cart
    </button>
    <button @click="removeItem">
    Remove item
    </button>

    <product-tabs :reviews="reviews"></product-tabs>

  </div>
  `,
  data() {
    return {
      product: "Socks",
      brand: "Adidos",
      description: "A pair of warm, fuzzy socks",
      selectedVariant: 0,
      // image: "./assests/black.jfif",
      // url: "https://www.amazon.in/",
      inventory: 100,
      isOnSale: true,
      details: ["80% cotton", "20% polyester", "gender-neutrel"],
      variants: [
        {
          variantId: 5001,
          variantColor: "black",
          variantImage: "./assests/black.jfif",
          variantQuantity: 10
        },
        {
          variantId: 5002,
          variantColor: "white",
          variantImage: "./assests/white.jfif",
          variantQuantity: 10
        }
      ],
      sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
      onSale: true,
      reviews: []
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeItem() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    uodateProduct(index) {
      // this.image = varientImage;
      this.selectedVariant = index;
    }
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      if (this.onSale) {
        return this.brand + " " + this.product + " are on sale!";
      }
      return this.brand + " " + this.product + " are not on sale";
    },
    shipping() {
      if (this.premium) return "free";
      return 99;
    }
  },
  mounted() {
    eventBus.$on("review-submitted", productReview => {
      this.reviews.push(productReview);
    });
  }
});

// product-details
Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
  <ul>
    <li v-for="detail in details">{{ detail }}</li>
  </ul>
`
});

// product-review
Vue.component("product-review", {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>

    <p>
      <label for="name">Name: </label>
      <input id="name" v-model="name">
    </p>

    <p>
      <label for="review">Review: </label>
      <input id="review" v-model="review">
    </p>

    <p>
      <label for="rating">Rating: </label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>

    <p>Would you recommend this product?</p>
      <label> Yes <input type="radio" value="Yes" v-model="recommend"/>
      </label>
      <label> No <input type="radio" value="No" v-model="recommend"/>
      </label>
    <p>
      <input type="submit" value="Submit">
    </p>
  </form>
`,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
        if (!this.recommend) this.errors.push("Recommendation required.");
      }
    }
  }
});

// tabs
Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
  <div>
      <span class="tab"
      :class="{ activeTab: selectedTab == tab}"
        v-for="(tab,index) in tabs" :key="index"
        @click="selectedTab=tab">{{ tab }}</span>


        <div v-show="selectedTab==='Reviews'">
        <h2>Reviews:</h2>
        <p v-if="!reviews.length">There are no reviews yet</p>
        <ul>
            <li v-for="review in reviews">
              <p>Name:{{review.name}}</p>
              <p>Rating:{{review.rating}}</p>
              <p>Comment:{{review.review}}</p>
            </li>
        </ul>
    </div>
    <product-review v-show="selectedTab==='Make a review'"></product-review>
  </div>

  </div>
  `,
  data() {
    return {
      tabs: ["Reviews", "Make a review"],
      selectedTab: "Reviews"
    };
  }
});

// product-info
Vue.component("info-tabs", {
  props: {
    shipping: {
      required: true
    },
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <div>
      <ul>
        <span class="tab" 
              :class="{ activeTab: selectedTab === tab }"
              v-for="(tab, index) in tabs"
              @click="selectedTab = tab"
              :key="tab"
        >{{ tab }}</span>
      </ul>

      <div v-show="selectedTab === 'Shipping'">
        <p>{{ shipping }}</p>
      </div>

      <div v-show="selectedTab === 'Details'">
        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>
      </div>
  
    </div>
  `,
  data() {
    return {
      tabs: ["Shipping", "Details"],
      selectedTab: "Shipping"
    };
  }
});

// root
var app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: []
  },
  methods: {
    uodateCart(id) {
      this.cart.push(id);
    },
    removeCart(id) {
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    }
  }
});
