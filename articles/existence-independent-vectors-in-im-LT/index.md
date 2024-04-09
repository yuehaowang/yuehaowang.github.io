# Proof: Existence of Linearly Independent Vectors in Images of Non-scalar-multiple Linear Transformations

- by Yuehao Wang
- Mar 17, 2020



This is a challenging problem in an exercise of *SI131 Linear Algebra for Information Science*. This article elaborates my thoughts in this problem.

**Proposition:** Let $$\tau_1, \tau_2: V\rightarrow V$$ be linear transformations such that one is not a scalar multiple of the other. Suppose that $$dim~Im(\tau_1),dim~Im(\tau_2)\geq 2$$. 

Then there exists a $$v\in V$$ such that $$\tau_1(v), \tau_2(v)$$ are linearly independent.

---

**Proof:**

Let $$Im(\tau_1) $$  be a subspace spanned by a set of basis $$U$$, $$Im(\tau_2)$$ be a subspace spanned by a set of basis $$W$$. There are two cases of $$U$$ and $$W$$:

1. If $$\exists u_a \in U$$, $$u_a$$ is linearly independent to basis in $$W$$.

   Find a $$v_1, v_2\in V$$ such that $$\tau_1(v_1)=u_a$$, $$\tau_2(v_2)$$ and $$\tau_2(v_1)$$ are not both zero (thus $$\tau_2(v_2) + \tau_2(v_1)$$ is not zero). We can guarantee that $$u_a + \tau_1(v_2) \neq 0$$ because we can arbitrarily scale $$v_2$$ and $$\tau_2(v_2)+\tau_2(v_1) \neq 0$$ will not be violated. Also notice that we can always find such $$v_1$$ and $$v_2$$ since $$dim~Im(\tau_1), dim~Im(\tau_2) \geq 2$$.

   Then we construct a new vector $$v_1+v_2 \in V$$,

   $$\tau_1(v_1+v_2)=u_a + \tau_1(v_2) \neq 0$$

   $$\tau_2(v_1+v_2)=\tau_2(v_1)+\tau_2(v_2) \neq 0$$

   **1)** If $$\tau_2(v_1) \neq 0$$ and $$\tau_2(v_2) \neq 0$$. Due to $$u_a$$ is linearly independent to any basis of $$Im(\tau_2)$$, $$u_a$$ is linearly independent to $$\tau_2(v_1)$$ and $$\tau_2(v_2)$$ $$\Rightarrow$$ $$\tau_1(v_1+v_2)$$ and $$\tau_2(v_1+v_2)$$ are linearly independent.

   **2)** If $$\tau_2(v_1) = 0$$ $$\Rightarrow$$ $$\tau_2(v_2) \neq 0$$. $$u_a$$ is linearly independent to $$\tau_2(v_2)$$  $$\Rightarrow$$ $$\tau_1(v_1+v_2)$$ and $$\tau_2(v_1+v_2)$$ are linearly independent.

   **3)** If $$\tau_2(v_2) = 0$$ $$\Rightarrow$$ $$\tau_2(v_1) \neq 0$$. Similar to **2)**.

2. If $$\forall u_a \in U$$, $$u_a$$ is linearly dependent to basis in $$W$$, then $$Im(\tau_1) $$ is also spanned by a set of basis $$W$$, i.e. $$Im(\tau_1), Im(\tau_2)$$ share a subspace.

   **Hypothesis:** Suppose $$\forall v \in V$$, $$\tau_1(v), \tau_2(v)$$ are linearly dependent. Therefore, $$\forall v_1, v_2 \in V$$, we have:

   $$\tau_1(v_1) = k_1\tau_2(v_1)$$

   $$\tau_1(v_2) = k_2\tau_2(v_2)$$

   W.L.O.G, we only care those cases in which $$\tau_1(v_1)$$ and $$\tau_1(v_2)$$ are non-zero. We can always find these $$v_1$$ and $$v_2$$ because $$dim~Im(\tau_1), dim~Im(\tau_2)\geq 2$$.

   Then we construct a vector $$v_1 + v_2 \in V$$.

   **1)** If $$\tau_1(v_1)$$ and $$\tau_1(v_2)$$ are linearly dependent and  $$\tau_1(v_1), \tau_1(v_2) \neq 0$$. Let $$\tau_1(v_2)=c\tau_1(v_1)$$, we have:

   ​	$$\tau_1(v_1+v_2) = (1+c)\tau_1(v_1)$$

   ​	$$\tau_2(v_1+v_2)=\frac{1}{k_1}\tau_1(v_1)+\frac{1}{k_2}\tau_1(v_2)=(\frac{1}{k_1}+\frac{c}{k_2})\tau_1(v_1)$$

   ​	Since they are still linearly dependent according to the hypothesis, $$\exists k_3$$:

   ​	$$[k_3(1+c) + (\frac{1}{k_1}+\frac{c}{k_2})]\tau_1(v_1)=0$$

   ​	Thus, we have $$k_1 = k_2 = -1/k_3$$.

   **2)** If $$\tau_1(v_1)$$ and $$\tau_1(v_2)$$ are linearly independent.

   ​	$$\tau_1(v_1+v_2) = k_1\tau_2(v_1) + k_2\tau_2(v_2)$$

   ​	$$\tau_2(v_1+v_2)=\tau_2(v_1) + \tau_2(v_2)$$

   ​	Since they are still linearly dependent according to the hypothesis, $$\exists k_3$$:

   ​	$$(k_3+k_1)\tau_2(v_1)+(k_3+k_2)\tau_2(v_2)=0$$

   ​	Due to the independence of $$\tau_1(v_1)$$ and $$\tau_1(v_2)$$, $$k_3+k_1 = k_3+k_2 = 0$$.

   ​	Thus, we have $$k_1=k_2=-k_3$$.

   **3)** For $$\forall v\in Ker(\tau_1), u\in V$$, we have:

   ​	$$\tau_1(v+u)=\tau_1(u)$$

   ​	$$\tau_2(v+u)=\tau_2(v) + \tau_2(u)$$

   ​	If $$\tau_1(u)$$ is linearly independent to $$\tau_2(v)$$, $$\tau_1(v+u)$$ and $$\tau_2(v+u)$$ can not be linearly dependent (contradict to our hypothesis). Thus, $$\tau_1(u)$$ is always linearly dependent to $$\tau_2(v)$$, even if we choose any basis as $$\tau_1(u)$$. In order to meet our condition $$dim~Im(\tau_1)\geq 2$$, $$\tau_2(v)=0$$, i.e. $$Ker(\tau_2)\subset Ker(\tau_1)$$. By the symmetric argument on $$\tau_2$$, we have $$Ker(\tau_1)\subset Ker(\tau_2)$$.

   ​	Thus, we have $$Ker(\tau_1) = Ker(\tau_2)$$.

   **1)**, **2)**, **3)** $$\Rightarrow$$ for any $$v \in V$$, if $$\tau_1(v), \tau_2(v)$$ are linearly dependent, then $$\tau_1(v)=k_1\tau_2(v)$$.

   However, $$\tau_1, \tau_2$$ are linear transformations such that one is not a scalar multiple of the other. $$\Rightarrow$$ Contradiction, i.e. $$\exists v\in V$$ such that $$\tau_1(v)$$ and $$\tau_1(v)$$ are linearly independent.

