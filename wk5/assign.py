import torch
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from keras.datasets.mnist import load_data


# load MNIST dataset
(X_train, y_train),(X_test, y_test) = load_data()

# train, validataion data split
X_train, X_val, y_train, y_val = train_test_split(X_train, y_train, test_size=0.2, random_state=0)

print(f"X_train: {X_train.shape}")
print(f"X_val: {X_val.shape}")
print(f"X_test: {X_test.shape}\n")

print(f"y_train: {y_train.shape}")
print(f"y_val: {y_val.shape}")
print(f"y_test: {y_test.shape}")

# train data visualization
plt.figure(figsize=(15,3))

for i, idx in enumerate(np.random.randint(X_train.shape[0], size=5)):

  img = X_train[idx, ...]
  label = y_train[idx]

  plt.subplot(1,5,i+1)
  plt.imshow(img, cmap="gray")
  plt.title(f'Label: {label}')


# data preprocessing
X_train = torch.from_numpy(X_train / 255.0).type(torch.float32)
X_val = torch.from_numpy(X_val / 255.0).type(torch.float32)
X_test = torch.from_numpy(X_test / 255.0).type(torch.float32)

y_train = torch.from_numpy(y_train)
y_val = torch.from_numpy(y_val)
y_test = torch.from_numpy(y_test)


import torch
import torch.nn as nn

'''
28x28 이미지
   ↓
Flatten
   ↓
784
   ↓
Linear(784 → 392)
ReLU
   ↓
Linear(392 → 198)
ReLU
   ↓
Linear(198 → 10)
'''


# model definition
class MyModel(nn.Module):
    def __init__(self, num_labels):
        super(MyModel, self).__init__()
        self.flatten = nn.Flatten()
        self.dense1 = nn.Sequential(nn.Linear(784,392), nn.ReLU())
        self.dense2 = nn.Sequential(nn.Linear(392,198), nn.ReLU())
        self.output = nn.Linear(198, num_labels)

    def forward(self, x):
        x = self.flatten(x)
        x = self.dense1(x)
        x = self.dense2(x)
        x = self.output(x)
        return x

# model creation
model = MyModel(num_labels=10)

# display model structure
print(model)

import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader

# hyperparameter setting
epochs = 10
batch_size = 128
lr = 1e-4
weight_decay = 1e-2

# loss function, optimizer setting
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=weight_decay)

# dataset, dataloader creation
train_dataset = TensorDataset(X_train, y_train)
val_dataset = TensorDataset(X_val, y_val)
train_dataloader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
val_dataloader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

# model training
for epoch in range(1,epochs+1):
    train_loss, train_acc, val_loss, val_acc = [], [], [], []
    model.train()                              # training mode of model
    for data, label in train_dataloader:
        pred = model(data)
        loss = criterion(pred, label)
        train_loss.append(loss)
        train_acc.append((pred.argmax(dim=-1)==label).sum() / len(label))

        optimizer.zero_grad()                  # remove accumulated gradient of parameters
        loss.backward()                        # gradient accumulation
        optimizer.step()                       # parameter update by accumulated gradient and optimizer

    model.eval()                               # evaluation mode of model
    for data, label in val_dataloader:
        with torch.no_grad():                  # turn off autograd (for calculation speed, memory efficiency)
            pred = model(data)
            loss = criterion(pred, label)
            val_loss.append(loss)
            val_acc.append((pred.argmax(dim=-1)==label).sum() / len(label))

    train_loss = torch.stack(train_loss).mean().item()
    train_acc = torch.stack(train_acc).mean().item()
    val_loss = torch.stack(val_loss).mean().item()
    val_acc = torch.stack(val_acc).mean().item()

    print(f"Epoch {epoch}/{epochs}")
    print(f"train loss: {round(train_loss, 4)}  train accuracy: {round(train_acc, 4)}")
    print(f"val loss: {round(val_loss, 4)}  val accuracy: {round(val_acc, 4)}\n")

# model evaluation
test_dataset = TensorDataset(X_test, y_test)
test_dataloader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

model.eval()

correct = 0
for data, label in test_dataloader:
    with torch.no_grad():
        pred = model(data)
        correct += (pred.argmax(dim=1)==label).sum()

test_acc = correct / len(test_dataset)

print(f"test accuracy: {test_acc}")

import torch

# save model and weights
torch.save(model, "model.pth")
torch.save(model.state_dict(), "model_sd.pth")

# load saved model and weights
model1 = torch.load("model.pth")

model2 = MyModel(num_labels=10)
model2.load_state_dict(torch.load("model_sd.pth", map_location="cpu"))