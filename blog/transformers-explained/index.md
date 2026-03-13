# Transformers: Attention Is All You Need

*Published: January 10, 2024*
*Category: Machine Learning*

The transformer architecture revolutionized NLP and has since expanded to computer vision, audio, and multimodal applications.

## Self-Attention Mechanism

The core innovation is the scaled dot-product attention:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

Where:
- $Q$ = Query matrix
- $K$ = Key matrix  
- $V$ = Value matrix
- $d_k$ = Dimension of keys

```python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    
    # Compute attention scores
    scores = torch.matmul(Q, K.transpose(-2, -1)) / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))
    
    # Apply mask if provided
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    
    # Softmax to get attention weights
    attn_weights = F.softmax(scores, dim=-1)
    
    # Apply attention to values
    output = torch.matmul(attn_weights, V)
    
    return output, attn_weights
```

## Multi-Head Attention

Multiple attention heads capture different aspects of relationships:

```python
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
    
    def forward(self, Q, K, V, mask=None):
        batch_size = Q.size(0)
        
        # Linear projections and reshape for multi-head
        Q = self.W_q(Q).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        K = self.W_k(K).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        V = self.W_v(V).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        
        # Apply attention
        attn_output, _ = scaled_dot_product_attention(Q, K, V, mask)
        
        # Concatenate heads and project
        attn_output = attn_output.transpose(1, 2).contiguous().view(batch_size, -1, self.n_heads * self.d_k)
        
        return self.W_o(attn_output)
```

## Positional Encoding

Since attention is permutation-invariant, we need positional information:

$$PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d}}\right)$$
$$PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d}}\right)$$

```python
import math

def positional_encoding(seq_len, d_model):
    position = torch.arange(seq_len).unsqueeze(1)
    div_term = torch.exp(torch.arange(0, d_model, 2) * (-math.log(10000.0) / d_model))
    
    pe = torch.zeros(seq_len, d_model)
    pe[:, 0::2] = torch.sin(position * div_term)
    pe[:, 1::2] = torch.cos(position * div_term)
    
    return pe
```

## Feed-Forward Network

Each transformer layer includes a position-wise FFN:

```python
class FeedForward(nn.Module):
    def __init__(self, d_model, d_ff, dropout=0.1):
        super().__init__()
        self.linear1 = nn.Linear(d_model, d_ff)
        self.linear2 = nn.Linear(d_ff, d_model)
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x):
        return self.linear2(self.dropout(F.gelu(self.linear1(x))))
```

## Layer Normalization

Pre-norm vs post-norm architectures:

```python
# Pre-norm (more stable training)
x = x + self.attention(self.norm1(x))
x = x + self.ffn(self.norm2(x))

# Post-norm (original paper)
x = self.norm1(x + self.attention(x))
x = self.norm2(x + self.ffn(x))
```

## Conclusion

The transformer architecture's simplicity and parallelizability have made it the dominant paradigm in modern deep learning. Understanding its components is essential for working with state-of-the-art models.
